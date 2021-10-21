package regapi

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

type courseParser struct {
	c    *Course
	errs []error
}

func newCourseParser() *courseParser {
	return &courseParser{
		c:    &Course{},
		errs: []error{},
	}
}

func (p *courseParser) handleError(err error) {
	if err != nil {
		p.errs = append(p.errs, err)
	}
}

func (p *courseParser) course() (*Course, []error) {
	if len(p.errs) > 0 {
		return nil, p.errs
	}
	return p.c, nil
}

func parseAcadyear(acadyear string) (int, error) {
	year, err := strconv.Atoi(acadyear[len(acadyear)-4:])
	if err != nil {
		return 0, err
	}
	return year - 543, nil
}

func parseSemester(semester string) (string, error) {
	switch semester {
	case "ภาคการศึกษาต้น", "ภาคการศึกษาที่หนึ่ง":
		return FirstSem, nil
	case "ภาคการศึกษาปลาย", "ภาคการศึกษาที่สอง":
		return SecondSem, nil
	case "ภาคฤดูร้อน", "ภาคการศึกษาที่สาม":
		return ThirdSem, nil
	}
	return "", fmt.Errorf("couldn't parse semester (got %s)", semester)
}

func parseProgram(program string) (string, error) {
	switch program {
	case "ทวิภาค":
		return Semester, nil
	case "ตรีภาค":
		return Trimeter, nil
	case "ทวิภาค - นานาชาติ":
		return International, nil
	}
	return "", fmt.Errorf("couldn't parse program (got %s)", program)
}

func (p *courseParser) parseDetail(s *goquery.Selection) {
	var err error
	rows := s.Find("tr")

	texts := strings.Split(getText(rows.Eq(1)), "/")
	p.c.Acadyear, err = parseAcadyear(texts[0])
	p.handleError(err)
	p.c.Semester, err = parseSemester(texts[1])
	p.handleError(err)
	p.c.Program, err = parseProgram(getText(rows.Eq(2)))
	p.handleError(err)

	fontNodes := rows.Eq(3).Find("font")
	p.c.Code = getText(fontNodes.Eq(0))
	p.c.Shortname = getText(fontNodes.Eq(1))
	p.c.Name = map[string]string{
		"th": getText(rows.Eq(4)),
		"en": getText(rows.Eq(5)),
	}
	p.c.Faculty = getText(rows.Eq(6))
}

func (p *courseParser) parseCreditAndRequirement(s *goquery.Selection) {
	rows := s.Find("tr")

	cells := rows.Eq(0).Find("td")
	p.c.TotalCredit = tryParseFloat(getText(cells.Eq(0)), 0)
	p.c.CreditDetail = getText(cells.Eq(2))

	hourDetail := getText(rows.Eq(1).Find("td"))
	if len(hourDetail) > 2 {
		hourDetail = hourDetail[1 : len(hourDetail)-1] // Remove "(" and ")"
	}
	p.c.HourDetail = hourDetail

	p.c.Requirement = getText(rows.Eq(2).Find("font").Eq(1))
}

func (p *courseParser) parseExam(s *goquery.Selection) {
	const midText = "วันสอบกลางภาค :"
	const finalText = " วันสอบปลายภาค :"
	text := getText(s.Find("tr > td font"))

	startIdx := strings.Index(text, midText) + len(midText)
	endIdx := strings.Index(text, finalText)
	midterm := strings.TrimSpace(text[startIdx:endIdx])

	startIdx = endIdx + len(finalText)
	endIdx = len(text)
	final := strings.TrimSpace(text[startIdx:endIdx])

	p.c.Exam = &Exam{
		Midterm: newExamTime(midterm),
		Final:   newExamTime(final),
	}
}

func appendTimetable(arr []Timetable, s *goquery.Selection, offset int) ([]Timetable, error) {
	timetable := Timetable{
		Method:     getText(s.Eq(2 + offset)),
		Days:       newTimetableDays(getText(s.Eq(3 + offset))),
		Time:       newClassTime(getText(s.Eq(4 + offset))),
		Building:   getText(s.Eq(5 + offset)),
		Room:       getText(s.Eq(6 + offset)),
		Instructor: getText(s.Eq(7 + offset)),
		Note:       getText(s.Eq(8 + offset)),
	}
	return append(arr, timetable), nil
}

func (p *courseParser) parseSections(s *goquery.Selection) {
	var err error
	p.c.Sections = make(map[string]*Section)
	rows := s.Find("tr")
	var lastSection *Section
	for i := 2; i < rows.Length(); i++ {
		cells := rows.Eq(i).Find("td")
		offset := 0

		if val, exist := cells.Eq(0).Attr("colspan"); exist && val == "2" {
			offset--
		} else {
			secNo := getText(cells.Eq(1))
			if lastSection == nil || lastSection.No != secNo {
				texts := strings.Split(getText(cells.Eq(9)), "/")
				regis, _ := strconv.Atoi(texts[0])
				maxRegis, _ := strconv.Atoi(texts[1])
				lastSection = &Section{
					No:          secNo,
					IsOpen:      getText(cells.Eq(0)) != "(ปิด)",
					Registered:  regis,
					MaxRegister: maxRegis,
					Timetables:  []Timetable{},
				}
				p.c.Sections[secNo] = lastSection
			}
		}

		lastSection.Timetables, err = appendTimetable(lastSection.Timetables, cells, offset)
		p.handleError(err)
	}
}

// ParsingError is used to store errors which occur while paring course data.
type ParsingError struct {
	summary string
	Errs    []error
}

func (e *ParsingError) Error() string {
	return e.summary
}

func newCourseFromDoc(doc *goquery.Document) (*Course, error) {
	parser := newCourseParser()
	tables := doc.Find("form > table")
	parser.parseDetail(tables.Eq(1))
	parser.parseCreditAndRequirement(tables.Eq(2))
	parser.parseExam(tables.Eq(3))
	parser.parseSections(tables.Eq(4))
	course, errs := parser.course()
	if errs != nil {
		return nil, &ParsingError{"parse course failed", errs}
	}
	return course, nil
}
