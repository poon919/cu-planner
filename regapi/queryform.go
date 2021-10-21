package regapi

import (
	"github.com/PuerkitoBio/goquery"
)

func parseAvailSemesters(doc *goquery.Document) []string {
	set := map[string]struct{}{}
	doc.Find("#examdateCombo option").Each(func(i int, s *goquery.Selection) {
		val, exists := s.Attr("value")
		if !exists || val == "" {
			return
		}
		set[val[:6]] = struct{}{}
	})
	keys := make([]string, 0, len(set))
	for k := range set {
		keys = append(keys, k)
	}
	return keys
}

func parseDefaultParams(doc *goquery.Document) map[string]string {
	params := make(map[string]string, 22)
	doc.Find("form [name]").Each(func(i int, s *goquery.Selection) {
		name, _ := s.Attr("name") // Always exists according to the selector
		if name == "submit" {
			params["submit.x"] = "0"
			params["submit.y"] = "0"
			return
		}
		if goquery.NodeName(s) == "select" {
			s = s.Find("option")
		}
		val := s.AttrOr("value", "")
		params[name] = val
	})
	return params
}
