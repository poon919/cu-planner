package regapi

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func Test_ExamTime(t *testing.T) {
	{
		eStart := "2020-12-12 17:30:00 +0700 +07"
		eEnd := "2020-12-12 20:30:00 +0700 +07"
		txt := "12 ธ.ค. 2563 เวลา 17:30-20:30 น."
		rt := newExamTime(txt)
		assert.Equal(t, eStart, rt.Start.String())
		assert.Equal(t, eEnd, rt.End.String())
		assert.Equal(t, "", rt.Status)
	}

	{
		txt := "TDF (รอประกาศ)"
		rt := newExamTime(txt)
		assert.Nil(t, rt.Start)
		assert.Nil(t, rt.End)
		assert.Equal(t, txt, rt.Status)
	}
}

func Test_ClassDay(t *testing.T) {
	{
		day := ClassDay("MO")
		assert.True(t, day.IsDeclared())
		assert.Equal(t, time.Monday, day.Weekday())
	}

	{
		day := ClassDay("IA")
		assert.False(t, day.IsDeclared())
		assert.Equal(t, time.Weekday(-1), day.Weekday())
	}

	{
		expected := []ClassDay{Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday}
		txt := "TU MO WE TH SA FR SU"
		days := newTimetableDays(txt)
		assert.Equal(t, expected, days)
	}
}

func Test_newClassTime(t *testing.T) {
	eStart := "13:00"
	eEnd := "15:00"

	{
		txt := "13:00-15:00"
		rt := newClassTime(txt)
		assert.Equal(t, eStart, rt.Start.String())
		assert.Equal(t, eEnd, rt.End.String())
		assert.Equal(t, "", rt.Status)
	}

	{
		txt := "TDF (รอประกาศ)"
		rt := newClassTime(txt)
		assert.Nil(t, rt.Start)
		assert.Nil(t, rt.End)
		assert.Equal(t, txt, rt.Status)
	}

	t.Log("Expect to correct an invalid time")
	{
		txt := "31:00-15:00"
		rt := newClassTime(txt)
		assert.Equal(t, eStart, rt.Start.String())
	}
}

func Test_timeJSON(t *testing.T) {
	{
		expected := []byte(`"15:30"`)
		got, err := Time{
			Hour:   15,
			Minute: 30,
		}.MarshalJSON()
		assert.NoError(t, err)
		assert.Equal(t, expected, got)
	}
	{
		expected := Time{
			Hour:   15,
			Minute: 30,
		}
		got := Time{}
		err := got.UnmarshalJSON([]byte(`"15:30"`))
		assert.NoError(t, err)
		assert.Equal(t, expected.Hour, got.Hour)
		assert.Equal(t, expected.Minute, got.Minute)
	}
}
