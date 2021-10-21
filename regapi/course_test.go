package regapi

import (
	"encoding/json"
	"io/ioutil"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCourse(t *testing.T) {
	doc, err := newDocFromFile("../testdata/0201211.html")
	if err != nil {
		panic(err)
	}
	course, err := newCourseFromDoc(doc)
	assert.NoError(t, err)

	j, err := json.MarshalIndent(course, "", "  ")
	assert.NoError(t, err)
	// ioutil.WriteFile("../testdata/0201211.json", j, 0644)

	b, err := ioutil.ReadFile("../testdata/0201211.json")
	if err != nil {
		panic(err)
	}
	assert.JSONEq(t, string(b), string(j))
}

func BenchmarkCourse(b *testing.B) {
	doc, err := newDocFromFile("../testdata/5500111.html")
	if err != nil {
		panic(err)
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		newCourseFromDoc(doc)
	}
}
