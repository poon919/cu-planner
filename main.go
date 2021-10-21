package main

import (
	"crypto/tls"
	"flag"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/poon919/cu-planner/server"
)

// ref: https://stackoverflow.com/a/54747682
func isFlagPassed(name string) bool {
	found := false
	flag.Visit(func(f *flag.Flag) {
		if f.Name == name {
			found = true
		}
	})
	return found
}

func main() {
	srvAddr := flag.String("addr", "", "Address for the server to listen on")
	srvPort := flag.String("port", "7777", "Port for the server to listen on. If not specific, use env \"PORT\" instead")
	useRedis := flag.Bool("redis", false, "Connect to redis server using the env \"REDIS_URL\"")
	flag.Parse()

	log.Println("Starting API server...")

	// Prevent the app from stop working when reg.chula's certificate expire
	ts := http.DefaultTransport.(*http.Transport).Clone()
	ts.TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

	srv, err := server.NewAPIServer(&server.ServerOptions{
		Client: &http.Client{
			Timeout:   10 * time.Second,
			Transport: ts,
		},
		ReteLimit: 100,
		Timeout:   10 * time.Second,
		UseRedis:  *useRedis,
	})
	if err != nil {
		log.Panic(err.Error())
	}

	if port, ok := os.LookupEnv("PORT"); !isFlagPassed("port") && ok {
		srvPort = &port
	}
	srv.ListenAndServe(*srvAddr + ":" + *srvPort)
}
