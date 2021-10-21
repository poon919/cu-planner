package server

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/poon919/cu-planner/regapi"
	"golang.org/x/time/rate"
)

var ErrRegCUNotResponse = errors.New("cannot connect to Chula server")

type errMessage struct {
	Message string `json:"message"`
}

type respMessage struct {
	Data      interface{} `json:"data"`
	Timestamp time.Time   `json:"timestamp"`
}

func apiNotFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(404)
	json.NewEncoder(w).Encode(errMessage{
		Message: "Endpoint not found",
	})
}

func writeError(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	var neterr net.Error
	switch {
	case errors.Is(err, regapi.ErrNotFound), errors.Is(err, regapi.ErrNoData):
		w.WriteHeader(404)
		json.NewEncoder(w).Encode(errMessage{
			Message: err.Error(),
		})
	case errors.Is(err, regapi.ErrInvalidParams):
		w.WriteHeader(400)
		json.NewEncoder(w).Encode(errMessage{
			Message: err.Error(),
		})
	case errors.Is(err, regapi.ErrNoParams),
		errors.Is(err, regapi.ErrNotReady),
		errors.Is(err, regapi.ErrUnknown):
		log.Println(err)
		w.WriteHeader(502)
		json.NewEncoder(w).Encode(errMessage{
			Message: "Chula server returns an error",
		})
	case errors.Is(err, ErrRegCUNotResponse),
		errors.Is(err, regapi.ErrStatusCode):
		w.WriteHeader(502)
		json.NewEncoder(w).Encode(errMessage{
			Message: err.Error(),
		})
	case errors.Is(err, ErrTooManyRequests):
		w.WriteHeader(503)
		json.NewEncoder(w).Encode(errMessage{
			Message: err.Error(),
		})
	case errors.As(err, &neterr) && neterr.Timeout():
		w.WriteHeader(504)
		json.NewEncoder(w).Encode(errMessage{
			Message: "Request timed out",
		})
	default:
		log.Printf("Unexpected error: %v", err)
		w.WriteHeader(500)
		json.NewEncoder(w).Encode(errMessage{
			Message: "Internal server error",
		})
	}
}

func writeJSONResponse(w http.ResponseWriter, v interface{}, code int) []byte {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	b, err := json.Marshal(respMessage{
		Data:      v,
		Timestamp: time.Now(),
	})
	if err != nil {
		w.WriteHeader(500)
		json.NewEncoder(w).Encode(errMessage{
			Message: "Internal Server Error",
		})
		return nil
	}
	w.WriteHeader(code)
	w.Write(b)

	return b
}

type ServerOptions struct {
	Client    *http.Client
	ReteLimit rate.Limit
	Timeout   time.Duration
	UseRedis  bool
}

var DefaultClientOptions = &ServerOptions{
	Client: &http.Client{
		Timeout: 5 * time.Second,
	},
	ReteLimit: 100,
	Timeout:   10 * time.Second,
	UseRedis:  false,
}

type APIServer struct {
	c     *client
	cache cacheClient
}

func NewAPIServer(opt *ServerOptions) (*APIServer, error) {
	if opt == nil {
		opt = DefaultClientOptions
	}

	var (
		cache cacheClient = noCache{}
		err   error
	)
	if opt.UseRedis {
		cache, err = newRedisCache(os.Getenv("REDIS_URL"), 10*time.Minute)
		if err != nil {
			return nil, fmt.Errorf("failed to setup Redis: %s", err.Error())
		}
	}

	srv := &APIServer{
		c:     nil,
		cache: cache,
	}
	srv.setupRegClient(&clientOptions{
		regClientOptions: &regapi.RegClientOptions{
			Client:  opt.Client,
			Retries: 2,
		},
		limiter: rate.NewLimiter(opt.ReteLimit, 1),
		timeout: opt.Timeout,
	})

	return srv, nil
}

func (s *APIServer) setupRegClient(opt *clientOptions) {
	c, err := setupRegClient(opt)
	if err != nil {
		log.Printf("Failed to setup RegClient: %v\n", err)
		go func() {
			time.Sleep(10 * time.Minute)
			s.setupRegClient(opt)
		}()
		return
	}

	s.c = c
	log.Println("RegClient online!")

	const renewClientPeriod = 24 * time.Hour
	go s.renewClient(renewClientPeriod)
}

func (s *APIServer) renewClient(d time.Duration) {
	time.Sleep(d)
	for {
		err := s.c.Renew()
		if err == nil {
			go s.renewClient(d)
			return
		}
		time.Sleep(10 * time.Minute)
	}
}

func (s *APIServer) writeRedisJSONResponse(w http.ResponseWriter, key string) error {
	data, err := s.cache.get(key)
	if err != nil {
		return err
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(200)
	w.Write(data)
	return nil
}

func (s *APIServer) getValidSemesters(w http.ResponseWriter, r *http.Request) {
	const cacheMaxAge = 60 * 60 * 1 // 1 hour
	w.Header().Set("Cache-Control", fmt.Sprintf("max-age=%v", cacheMaxAge))

	res := s.c.Semesters()
	writeJSONResponse(w, res, 200)
}

func (s *APIServer) getCourseList(w http.ResponseWriter, r *http.Request) {
	semCode := chi.URLParam(r, "semCode")
	code := r.URL.Query().Get("code")
	shortname := r.URL.Query().Get("shortname")

	program, acadyear, semester, err := splitSemesterCode(semCode)
	if err != nil {
		writeError(w, err)
		return
	}

	cl, err := s.c.GetCourseList(program, acadyear, semester, code, shortname)
	if err != nil {
		writeError(w, err)
		return
	}
	writeJSONResponse(w, cl, 200)
}

func (s *APIServer) getCourse(w http.ResponseWriter, r *http.Request) {
	semCode := chi.URLParam(r, "semCode")
	code := chi.URLParam(r, "code")

	program, acadyear, semester, err := splitSemesterCode(semCode)
	if err != nil {
		writeError(w, err)
		return
	}

	const cacheMaxAge = 60 * 60 * 24 * 7 // 7 days
	w.Header().Set("Cache-Control", fmt.Sprintf("max-age=%v", cacheMaxAge))

	key := program + strconv.Itoa(acadyear) + semester + code
	if err := s.writeRedisJSONResponse(w, key); err == nil {
		return
	}

	course, err := s.c.GetCourse(program, acadyear, semester, code)
	if err != nil {
		writeError(w, err)
		return
	}
	if data := writeJSONResponse(w, course, 200); data != nil {
		s.cache.set(key, data)
	}
}

func (s *APIServer) ensureOnline(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if s.c == nil {
			writeError(w, ErrRegCUNotResponse)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *APIServer) ListenAndServe(addr string) {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Compress(1))

	r.With(s.ensureOnline).Route("/api", func(r chi.Router) {
		r.Get("/semesters/{semCode}/courses", s.getCourseList)
		r.Get(`/semesters/{semCode}/courses/{code}`, s.getCourse)
		r.Get("/semesters", s.getValidSemesters)
		r.NotFound(apiNotFoundHandler)
	})
	fileServer(r, "/", "app/")

	srv := http.Server{
		Addr:    addr,
		Handler: r,
	}
	intCh := make(chan os.Signal, 1)
	signal.Notify(intCh, os.Interrupt)

	go func() {
		<-intCh

		log.Println("Shutting down ...")
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		srv.Shutdown(ctx)
		s.cache.close()

		<-ctx.Done()
		log.Println("Server is offline.")
	}()

	log.Printf("Listening on %s\n", srv.Addr)
	srv.ListenAndServe()
}

func splitSemesterCode(s string) (string, int, string, error) {
	if len(s) != 6 {
		return "", -1, "", regapi.ErrNoData
	}
	year, err := strconv.Atoi(s[1:5])
	if err != nil {
		return "", -1, "", regapi.ErrNoData
	}
	return s[0:1], year, s[5:6], nil
}
