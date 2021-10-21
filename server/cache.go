package server

import (
	"context"
	"errors"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
)

var errNoCache = errors.New("no cache in used")

type cacheClient interface {
	get(key string) ([]byte, error)
	set(key string, value interface{}) error
	close() error
}

type noCache struct{}

func (c noCache) get(key string) ([]byte, error) {
	return nil, errNoCache
}

func (c noCache) set(key string, value interface{}) error {
	return nil
}

func (c noCache) close() error {
	return nil
}

type redisCache struct {
	client *redis.Client
	ctx    context.Context
	expire time.Duration
}

func newRedisCache(url string, expire time.Duration) (redisCache, error) {
	opt, err := redis.ParseURL(os.Getenv("REDIS_URL"))
	if err != nil {
		return redisCache{}, err
	}
	opt.Username = "" // issue: https://github.com/go-redis/redis/issues/1343

	client := redis.NewClient(opt)
	ctx := context.Background()
	_, err = client.Ping(ctx).Result()
	if err != nil {
		return redisCache{}, err
	}
	return redisCache{client, ctx, expire}, nil
}

func (c redisCache) get(key string) ([]byte, error) {
	return c.client.Get(c.ctx, key).Bytes()
}

func (c redisCache) set(key string, value interface{}) error {
	return c.client.Set(c.ctx, key, value, c.expire).Err()
}

func (c redisCache) close() error {
	return c.client.Close()
}
