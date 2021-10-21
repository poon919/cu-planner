package regapi

import (
	"errors"
	"sort"

	"github.com/PuerkitoBio/goquery"
)

func parseResultRow(s *goquery.Selection) (QueryResult, error) {
	cells := s.Find("td")
	link := cells.Eq(1).Find("a")
	if link == nil {
		return QueryResult{}, errors.New("couldn't parse result")
	}

	var (
		code  string
		name  string
		exist bool
	)

	name = getText(cells.Eq(2))
	if code, exist = link.Attr("title"); !exist {
		return QueryResult{}, errors.New("couldn't parse result")
	}
	return QueryResult{
		Code:      code,
		Shortname: name,
	}, nil
}

func newQResultsFromDoc(doc *goquery.Document) []QueryResult {
	results := []QueryResult{}
	doc.Find("form > table:nth-child(3) tr").Each(func(i int, s *goquery.Selection) {
		if res, err := parseResultRow(s); err == nil {
			results = append(results, res)
		}
	})
	sort.Slice(results, func(i, j int) bool { return results[i].Code < results[j].Code })
	return results
}
