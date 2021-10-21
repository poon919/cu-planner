package regapi

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNotfound(t *testing.T) {
	doc, err := newDocFromFile("../testdata/err/notfound-courselist.html")
	if err != nil {
		panic(err)
	}
	err = checkForErr(doc)
	assertErrorIs(t, ErrNotFound, err)
}

func TestNotReady(t *testing.T) {
	doc, err := newDocFromFile("../testdata/err/notready-courselist.html")
	if err != nil {
		panic(err)
	}
	err = checkForErr(doc)
	assertErrorIs(t, ErrNotReady, err)
	doc, err = newDocFromFile("../testdata/err/notready-course.html")
	assert.NoError(t, err)
	err = checkForErr(doc)
	assertErrorIs(t, ErrNotReady, err)
}

func TestNoParams(t *testing.T) {
	doc, err := newDocFromFile("../testdata/err/noparam-courselist.html")
	if err != nil {
		panic(err)
	}
	err = checkForErr(doc)
	assertErrorIs(t, ErrNoParams, err)
	doc, err = newDocFromFile("../testdata/err/noparam-course.html")
	assert.NoError(t, err)
	err = checkForErr(doc)
	assertErrorIs(t, ErrNoParams, err)
}
