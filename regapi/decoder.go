package regapi

import (
	"io"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/text/encoding/htmlindex"
)

// ref: https://github.com/PuerkitoBio/goquery/wiki/Tips-and-tricks
func decodeToUTF8(r io.Reader, charset string) (io.Reader, error) {
	enc, err := htmlindex.Get(charset)
	if err != nil {
		return nil, err
	}
	return enc.NewDecoder().Reader(r), nil
}

func newDocFromTIS620(r io.Reader) (*goquery.Document, error) {
	r, err := decodeToUTF8(r, "tis-620")
	if err != nil {
		return nil, err
	}
	doc, err := goquery.NewDocumentFromReader(r)
	if err != nil {
		return nil, err
	}
	return doc, nil
}
