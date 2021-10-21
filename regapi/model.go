package regapi

import (
	"time"
)

type QueryResult struct {
	Code      string `json:"code"`
	Shortname string `json:"shortname"`
}

// ClassTime is used to store timetable time.
//
// If Status is not an empty string, both Start and End are nil.
// Otherwise, Start and End would contain the time.
type ClassTime struct {
	Start  *Time  `json:"start"`
	End    *Time  `json:"end"`
	Status string `json:"status"`
}

type Timetable struct {
	Method     string     `json:"method"`
	Days       []ClassDay `json:"days"`
	Time       ClassTime  `json:"time"`
	Building   string     `json:"building"`
	Room       string     `json:"room"`
	Instructor string     `json:"instructor"`
	Note       string     `json:"note"`
}

type Section struct {
	IsOpen      bool        `json:"isOpen"`
	No          string      `json:"no"`
	Registered  int         `json:"registered"`
	MaxRegister int         `json:"maxRegister"`
	Timetables  []Timetable `json:"timetables"`
}

// ExamTime is used to store timetable time.
//
// If Status is not an empty string, both Start and End are nil.
// Otherwise, Start and End would contain the time.
type ExamTime struct {
	Start  *time.Time `json:"start"`
	End    *time.Time `json:"end"`
	Status string     `json:"status"`
}

type Exam struct {
	Midterm ExamTime `json:"midterm"`
	Final   ExamTime `json:"final"`
}

type Course struct {
	Code      string            `json:"code"`
	Shortname string            `json:"shortname"`
	Name      map[string]string `json:"name"`

	Faculty  string `json:"faculty"`
	Program  string `json:"program"`
	Acadyear int    `json:"acadyear"`
	Semester string `json:"semester"`

	TotalCredit  float32 `json:"totalCredit"`
	CreditDetail string  `json:"creditDetail"`
	HourDetail   string  `json:"hourDetail"`

	Requirement string `json:"requirement"`

	Exam *Exam `json:"exam"`

	Sections map[string]*Section `json:"sections"`
}
