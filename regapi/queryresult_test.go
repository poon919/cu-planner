package regapi

import (
	"encoding/json"
	"io/ioutil"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestQueryResult(t *testing.T) {
	doc, err := newDocFromFile("../testdata/cl_55001.html")
	if err != nil {
		panic(err)
	}
	res := newQResultsFromDoc(doc)

	j, err := json.MarshalIndent(res, "", "  ")
	assert.NoError(t, err)
	// ioutil.WriteFile("../testdata/cl_55001.json", j, 0644)

	b, err := ioutil.ReadFile("../testdata/cl_55001.json")
	if err != nil {
		panic(err)
	}
	assert.JSONEq(t, string(b), string(j))
}
