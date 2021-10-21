package regapi

import (
	"net/http"
	"net/http/cookiejar"
)

type session struct {
	jar *cookiejar.Jar
}

func (s *session) writeCookies(req *http.Request) {
	for _, cookie := range s.jar.Cookies(req.URL) {
		req.AddCookie(cookie)
	}
}

func (s *session) readCookies(resp *http.Response) {
	if ck := resp.Cookies(); len(ck) > 0 {
		s.jar.SetCookies(resp.Request.URL, ck)
	}
}

func (s *session) do(c *http.Client, req *http.Request) (*http.Response, error) {
	s.writeCookies(req)
	resp, err := c.Do(req)
	if err != nil {
		return nil, err
	}
	s.readCookies(resp)
	return resp, nil
}

func newSession() (session, error) {
	jar, err := cookiejar.New(nil)
	if err != nil {
		return session{}, err
	}
	return session{jar}, nil
}
