package regapi

import (
	"errors"
	"fmt"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

var loc *time.Location

func init() {
	var err error
	loc, err = time.LoadLocation("Asia/Bangkok")
	if err != nil {
		loc = time.FixedZone("UTC+7", 7*60*60)
	}
}

// ClassDay is used to store timetable's day
type ClassDay string

const (
	Monday    ClassDay = "MO"
	Tuesday   ClassDay = "TU"
	Wednesday ClassDay = "WE"
	Thursday  ClassDay = "TH"
	Friday    ClassDay = "FR"
	Saturday  ClassDay = "SA"
	Sunday    ClassDay = "SU"
)

// Weekday converts ClassDay to the corresponding time.Weekday.
// If the day is not declared, returns time.Weekday(-1) instead.
func (c ClassDay) Weekday() time.Weekday {
	switch c {
	case "MO":
		return time.Monday
	case "TU":
		return time.Tuesday
	case "WE":
		return time.Wednesday
	case "TH":
		return time.Thursday
	case "FR":
		return time.Friday
	case "SA":
		return time.Saturday
	case "SU":
		return time.Sunday
	default:
		return time.Weekday(-1)
	}
}

// IsDeclared returns whether the day is declared.
func (c ClassDay) IsDeclared() bool {
	return c.Weekday() != -1
}

var reExamTime = regexp.MustCompile(`(\d+) (.+?) (\d+) เวลา (\d+:\d+)-(\d+:\d+)`)

// Time is used to store time only data such as timetable time.
type Time struct {
	Hour   int
	Minute int
}

func (t Time) String() string {
	return fmt.Sprintf("%02d:%02d", t.Hour, t.Minute)
}

// MarshalJSON encodes Time struct into json string in "{hour}:{minute}" format.
func (t Time) MarshalJSON() ([]byte, error) {
	s := fmt.Sprintf("\"%s\"", t.String())
	return []byte(s), nil
}

// UnmarshalJSON decodes json string in "{hour}:{minute}" format into Time struct.
func (t *Time) UnmarshalJSON(data []byte) error {
	newTime, err := ParseTime(string(data[1 : len(data)-1]))
	if err != nil {
		return err
	}
	*t = newTime
	return nil
}

// ParseTime parses time string in format 15:04.
// Typos such as 90:00 will be interpreted as 09:00
func ParseTime(value string) (Time, error) {
	var (
		hour   int
		minute int
		err    error
	)

	arr := strings.Split(value, ":")
	if hour, err = atoiRange(0, arr[0], 23); err != nil {
		return Time{}, fmt.Errorf("parse time failed: hour out of bound (got %s)", arr[0])
	}
	if minute, err = atoiRange(0, arr[1], 59); err != nil {
		return Time{}, fmt.Errorf("parse time failed: minute out of bound (got %s)", arr[1])
	}
	return Time{
		Hour:   hour,
		Minute: minute,
	}, nil
}

func swapTwoDigit(num int) int {
	return (num%10)*10 + num/10
}

func isNumInRange(min int, num int, max int) bool {
	return min <= num && num <= max
}

func atoiRange(min int, s string, max int) (int, error) {
	num, err := strconv.Atoi(s)
	if err != nil {
		return 0, err
	}
	if isNumInRange(min, num, max) {
		return num, nil
	}
	// Try to swap digit e.g. 90:00 => 09:00
	num = swapTwoDigit(num)
	if isNumInRange(min, num, max) {
		return num, nil
	}
	return 0, errors.New("value out of bound")
}

func parseTHMonth(s string) (time.Month, error) {
	switch s {
	case "ม.ค.":
		return time.January, nil
	case "ก.พ.":
		return time.February, nil
	case "มี.ค.":
		return time.March, nil
	case "เม.ย.":
		return time.April, nil
	case "พ.ค.":
		return time.May, nil
	case "มิ.ย.":
		return time.June, nil
	case "ก.ค.":
		return time.July, nil
	case "ส.ค.":
		return time.August, nil
	case "ก.ย.":
		return time.September, nil
	case "ต.ค.":
		return time.October, nil
	case "พ.ย.":
		return time.November, nil
	case "ธ.ค.":
		return time.December, nil
	default:
		return 0, fmt.Errorf("invalid month (got %s)", s)
	}
}

func newExamTime(s string) ExamTime {
	fallback := ExamTime{
		Start:  nil,
		End:    nil,
		Status: s,
	}
	matches := reExamTime.FindStringSubmatch(s)

	if len(matches) != 6 {
		return fallback
	}

	var (
		year  int
		month time.Month
		day   int
		start Time
		end   Time
		err   error
	)

	if day, err = strconv.Atoi(matches[1]); err != nil {
		return fallback
	}
	if month, err = parseTHMonth(matches[2]); err != nil {
		return fallback
	}
	if year, err = strconv.Atoi(matches[3]); err != nil {
		return fallback
	}
	if start, err = ParseTime(matches[4]); err != nil {
		return fallback
	}
	if end, err = ParseTime(matches[5]); err != nil {
		return fallback
	}

	startDate := time.Date(year-543, month, day, start.Hour, start.Minute, 0, 0, loc)
	endDate := time.Date(year-543, month, day, end.Hour, end.Minute, 0, 0, loc)
	return ExamTime{
		Start:  &startDate,
		End:    &endDate,
		Status: "",
	}
}

func newClassTime(s string) ClassTime {
	fallback := ClassTime{
		Start:  nil,
		End:    nil,
		Status: s,
	}
	texts := strings.Split(s, "-")

	// Time may not be declared, e.g. "AR"
	// or this is an invalid time format
	if len(texts) != 2 {
		return fallback
	}

	var (
		start Time
		end   Time
		err   error
	)

	if start, err = ParseTime(texts[0]); err != nil {
		return fallback
	}
	if end, err = ParseTime(texts[1]); err != nil {
		return fallback
	}
	return ClassTime{
		Start:  &start,
		End:    &end,
		Status: "",
	}
}

func newTimetableDays(s string) []ClassDay {
	days := []ClassDay{}
	for _, day := range strings.Fields(s) {
		days = append(days, ClassDay(day))
	}
	sort.Slice(days, func(i, j int) bool { return days[i].Weekday() < days[j].Weekday() })
	return days
}
