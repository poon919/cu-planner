package regapi

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_parseValidKeys(t *testing.T) {
	doc, err := newDocFromFile("../testdata/query_header.html")
	if err != nil {
		panic(err)
	}
	keys := parseAvailSemesters(doc)

	t.Log("A key must be unique")
	{
		set := map[string]struct{}{}
		for _, k := range keys {
			set[k] = struct{}{}
		}
		assert.Equalf(t, len(set), len(keys), "a set of keys is not unique:\n%v", keys)
	}

	t.Log("Each key should be in {program}{acadyear}{semester} format")
	{
		validPrograms := []string{Semester, Trimeter, International}
		validSemesters := []string{FirstSem, SecondSem, ThirdSem}
		for _, k := range keys {
			assert.Contains(t, validPrograms, k[0:1], "Key: %v has invalid program: %v", k, k[0:1])
			_, err = parseAcadyear(k[1:5])
			assert.NoErrorf(t, err, "Key: %v has invalid acadyear: %v", k, k[1:5])
			assert.Contains(t, validSemesters, k[5:6], "Key: %v has invalid semester: %v", k, k[5:6])
		}
	}
}

func Test_parseDefaultParams(t *testing.T) {
	doc, err := newDocFromFile("../testdata/query_header.html")
	if err != nil {
		panic(err)
	}
	params := parseDefaultParams(doc)

	t.Log("Expect to have 22 parameters")
	{
		assert.Equal(t, 22, len(params))
	}
}
