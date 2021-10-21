package regapi

import (
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
)

var (
	// ErrInvalidParams indicates that a parameter value being sent to reg.chula is invalid
	ErrInvalidParams = errors.New("invalid parameter value")

	// ErrNoData indicates that reg.chula has no course data for a specific semester.
	ErrNoData = errors.New("no data for this semester")

	// ErrStatusCode indicates that reg.chula returns status code other than 2xx.
	ErrStatusCode = errors.New("Chula server returns invalid status code")

	courseListURL   = "https://cas.reg.chula.ac.th/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseListNewServlet"
	courseURLFormat = "https://cas.reg.chula.ac.th/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseScheduleDtlNewServlet?courseNo=%v&studyProgram=%v"
	defaultHeader   = http.Header{
		"accept":                    {"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"},
		"accept-language":           {"en-US,en;q=0.9,th;q=0.8"},
		"accept-encoding":           {"gzip, deflate, br"},
		"cache-control":             {"max-age=0"},
		"connection":                {"keep-alive"},
		"upgrade-insecure-requests": {"1"},
		"user-agent":                {"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36"},
	}
)

func newDocFromResponse(resp *http.Response) (*goquery.Document, error) {
	defer func() {
		io.Copy(ioutil.Discard, resp.Body)
		resp.Body.Close()
	}()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("%w: %v", ErrStatusCode, resp.StatusCode)
	}
	return newDocFromTIS620(resp.Body)
}

// RegClientOptions represent options for RegClient
type RegClientOptions struct {
	Client *http.Client

	// Maximum retry count for requests sent to reg.chula
	Retries int
}

// NewRegClient returns a ready-to-use Regclient given the optional options.
func NewRegClient(opt *RegClientOptions) (*RegClient, error) {
	if opt.Retries < 1 {
		opt.Retries = 1
	}
	c := &RegClient{
		RegClientOptions: *opt,
	}
	err := c.Renew()
	return c, err
}

// RegClient is a thread-safe http client used to send requests to reg.chula
type RegClient struct {
	RegClientOptions
	defaultParams map[string]string

	// sessKeys is a list of available semesters in "{program}{acadyear}{semester}" format.
	sessKeys []string

	// sessMap is a mapping from sessKeys to its session.
	//
	// reg.chula use session to determine which semester will be used while requesting a course,
	// so each semester should use a different session to prevent race condition while requesting.
	sessMap map[string]session
	mu      sync.RWMutex
}

func (c *RegClient) newQueryParams(overrides map[string]string) (url.Values, error) {
	params := make(url.Values, 22)
	for k, v := range c.defaultParams {
		if override, ok := overrides[k]; ok {
			v = override
		}
		params.Set(k, v)
	}

	beAcadYear := params.Get("acadyearEfd")
	program := params.Get("studyProgram")
	semester := params.Get("semester")
	if program != Semester && program != Trimeter && program != International {
		return nil, fmt.Errorf("%w: studyProgram must be S, T or I (got %s)", ErrInvalidParams, program)
	}
	if semester != FirstSem && semester != SecondSem && semester != ThirdSem {
		return nil, fmt.Errorf("%w: semester must be 1, 2 or 3 (got %s)", ErrInvalidParams, semester)
	}

	// coursetype == "2" is not implemented
	if params.Get("coursetype") != "" {
		return nil, fmt.Errorf("%w: coursetype must be \"\"", ErrInvalidParams)
	}

	// Use the same validation and replacement rules as reg.chula
	code := params.Get("courseno")
	shortname := params.Get("coursename")
	if code == "" && shortname == "" {
		return nil, fmt.Errorf("%w: require either courseno or coursename", ErrInvalidParams)
	}
	if len(code) == 1 && len(shortname) < 4 {
		return nil, fmt.Errorf("%w: courseno need at least 2 characters", ErrInvalidParams)
	}
	if len(code) == 0 && len(shortname) == 1 {
		return nil, fmt.Errorf("%w: coursename need at least 2 characters", ErrInvalidParams)
	}
	if len(code) >= 2 {
		params.Set("faculty", code[:2])
	} else if len(code) == 0 {
		params.Set("faculty", "")
	}
	params.Set("coursename", strings.ToUpper(shortname))
	params.Set("acadyear", beAcadYear)
	return params, nil
}

func (c *RegClient) newRequestWithSession(sess session, method, url string, body io.Reader, params url.Values) (*http.Response, error) {
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, err
	}
	req.Header = defaultHeader.Clone()
	if params != nil {
		req.URL.RawQuery = params.Encode()
	}
	return sess.do(c.Client, req)
}

// Semesters returns a list of available semesters in "{program}{acadyear}{semester}" format.
func (c *RegClient) Semesters() []string {
	c.mu.RLock()
	defer c.mu.RUnlock()

	buf := make([]string, len(c.sessKeys))
	copy(buf, c.sessKeys)
	return buf
}

func (c *RegClient) getSession(program string, acadyear int, semester string) (session, bool) {
	sess, ok := c.sessMap[program+strconv.Itoa(acadyear)+semester]
	return sess, ok
}

// HasData returns whether reg.chula has course data for a specific semester
func (c *RegClient) HasData(program string, acadyear int, semester string) bool {
	c.mu.RLock()
	defer c.mu.RUnlock()

	_, ok := c.getSession(program, acadyear, semester)
	return ok
}

// GetCourseList perform a request to get courses from reg.chula.
//
// If matching courses are not found, an empty slice will be returned.
// The results are sorted by its code and any unparsable results will be discarded.
func (c *RegClient) GetCourseList(program string, acadyear int, semester, code, shortname string) ([]QueryResult, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	params, err := c.newQueryParams(map[string]string{
		"studyProgram": program,
		"acadyearEfd":  strconv.Itoa(acadyear + 543),
		"semester":     semester,
		"courseno":     code,
		"coursename":   shortname,
	})
	if err != nil {
		return nil, err
	}

	sess, ok := c.getSession(program, acadyear, semester)
	if !ok {
		return nil, ErrNoData
	}

	var (
		tryCount = 0
		resp     *http.Response
		doc      *goquery.Document
	)
	for tryCount <= c.Retries {
		tryCount++
		if tryCount > 1 {
			time.Sleep(1 * time.Second)
		}

		resp, err = c.newRequestWithSession(sess, http.MethodGet, courseListURL, nil, params)
		if err != nil {
			continue
		}
		doc, err = newDocFromResponse(resp)
		if err != nil {
			continue
		}

		err = checkForErr(doc)
		switch {
		case err == nil:
			return newQResultsFromDoc(doc), nil
		case errors.Is(err, ErrNotFound):
			return []QueryResult{}, nil
		case errors.Is(err, ErrUnknown):
			return nil, err
		default:
		}
	}
	return nil, err
}

// GetCourse perform a request to get a course from reg.chula
//
// If the requested course is not found, ErrNotFound will be returned.
func (c *RegClient) GetCourse(program string, acadyear int, semester, code string) (*Course, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if len(code) != 7 {
		return nil, errors.New("require 7 digits of code")
	}

	params, err := c.newQueryParams(map[string]string{
		"studyProgram": program,
		"acadyearEfd":  strconv.Itoa(acadyear + 543),
		"semester":     semester,
		"courseno":     code,
		"coursename":   "",
	})
	if err != nil {
		return nil, err
	}

	sess, ok := c.getSession(program, acadyear, semester)
	if !ok {
		return nil, ErrNoData
	}

	var (
		courseURL = fmt.Sprintf(courseURLFormat, code, program)
		tryCount  = 0
		resp      *http.Response
		doc       *goquery.Document
	)
	for tryCount <= c.Retries {
		tryCount++
		if tryCount > 1 {
			time.Sleep(1 * time.Second)
			resp, err = c.newRequestWithSession(sess, http.MethodGet, courseListURL, nil, params)
			if err != nil {
				continue
			}
			doc, err = newDocFromResponse(resp)
			if err != nil {
				continue
			}
			if err = checkForErr(doc); err == ErrNotFound {
				// Check for whether the requested course exists.
				return nil, err
			}
		}

		resp, err = c.newRequestWithSession(sess, http.MethodGet, courseURL, nil, nil)
		if err != nil {
			continue
		}
		doc, err = newDocFromResponse(resp)
		if err != nil {
			continue
		}

		err = checkForErr(doc)
		switch {
		case err == nil:
			return newCourseFromDoc(doc)
		case errors.Is(err, ErrNotFound) || errors.Is(err, ErrUnknown):
			// Currently, the response from GetCourse never returns ErrNotFound.
			// To check whether the course exist, GetCourseList must be called.
			return nil, err
		default:
		}
	}
	return nil, err
}

// Renew retrieves default parameters and available semesters from reg.chula
func (c *RegClient) Renew() error {
	var (
		queryHeaderURL = "https://cas.reg.chula.ac.th/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.QueryCourseScheduleNewServlet"
		tryCount       = 0
		resp           *http.Response
		doc            *goquery.Document
		err            error
	)
	for tryCount <= c.Retries {
		tryCount++
		if tryCount > 1 {
			time.Sleep(1 * time.Second)
		}

		resp, err = c.Client.Get(queryHeaderURL)
		if err != nil {
			continue
		}
		doc, err = newDocFromResponse(resp)
		if err != nil {
			continue
		}
		break
	}
	if err != nil {
		return err
	}

	c.mu.Lock()
	defer c.mu.Unlock()
	c.defaultParams = parseDefaultParams(doc)
	c.sessKeys = parseAvailSemesters(doc)
	c.sessMap = make(map[string]session)
	for _, key := range c.sessKeys {
		sess, err := newSession()
		if err != nil {
			return fmt.Errorf("failed to setup session: %w", err)
		}
		c.sessMap[key] = sess
	}

	return nil
}
