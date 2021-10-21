package server

import (
	"context"
	"errors"
	"time"

	"github.com/poon919/cu-planner/regapi"
	"golang.org/x/time/rate"
)

var ErrTooManyRequests = errors.New("server is handling too many requests")

type clientOptions struct {
	regClientOptions *regapi.RegClientOptions
	limiter          *rate.Limiter
	timeout          time.Duration
}

type client struct {
	*regapi.RegClient
	limiter *rate.Limiter
	timeout time.Duration
}

func setupRegClient(opt *clientOptions) (*client, error) {
	rc, err := regapi.NewRegClient(opt.regClientOptions)
	if err != nil {
		return nil, err
	}
	return &client{
		RegClient: rc,
		limiter:   opt.limiter,
		timeout:   opt.timeout,
	}, nil
}

func (c *client) GetCourseList(program string, acadyear int, semester, code, shortname string) ([]regapi.QueryResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), c.timeout)
	defer cancel()
	err := c.limiter.Wait(ctx)
	if err != nil {
		return nil, ErrTooManyRequests
	}
	return c.RegClient.GetCourseList(program, acadyear, semester, code, shortname)
}

func (c *client) GetCourse(program string, acadyear int, semester, code string) (*regapi.Course, error) {
	ctx, cancel := context.WithTimeout(context.Background(), c.timeout)
	defer cancel()
	err := c.limiter.Wait(ctx)
	if err != nil {
		return nil, ErrTooManyRequests
	}
	return c.RegClient.GetCourse(program, acadyear, semester, code)
}
