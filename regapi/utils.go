package regapi

import (
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func combineSpaces(s string) string {
	return strings.Join(strings.Fields(s), " ")
}

func getText(s *goquery.Selection) string {
	return combineSpaces(strings.TrimSpace(s.Text()))
}

func tryParseFloat(s string, fallback float32) float32 {
	num, err := strconv.ParseFloat(s, 32)
	if err != nil {
		return fallback
	}
	return float32(num)
}
