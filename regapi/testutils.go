package regapi

import (
	"errors"
	"os"

	"github.com/PuerkitoBio/goquery"
	"github.com/stretchr/testify/assert"
)

func newDocFromFile(filename string) (*goquery.Document, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	doc, err := newDocFromTIS620(file)
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func assertErrorIs(t assert.TestingT, expected, err error) {
	if !errors.Is(err, expected) {
		t.Errorf("Unexpected error:\n"+
			"expected: %q\n"+
			"actual  : %q", expected.Error(), err.Error())
	}
}
