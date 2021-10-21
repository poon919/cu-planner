package regapi

import (
	"errors"
	"fmt"

	"github.com/PuerkitoBio/goquery"
)

var (
	// ErrNotFound represents a reg.chula error message "ไม่พบรายวิชา"
	ErrNotFound = errors.New("not found")

	// ErrNotReady represents a reg.chula error message "ระบบยังไม่พร้อมใช้งานในขณะนี้ กรุณาทำรายการใหม่อีกครั้ง"
	ErrNotReady = errors.New("not ready")

	// ErrNoParams represents a reg.chula error message "ไม่มีการส่งค่าพารามิเตอร์"
	ErrNoParams = errors.New("no params")

	// ErrUnknown represents other reg.chula error messages.
	// This error should be wrapped with the actual error message.
	ErrUnknown = errors.New("Chula server returns an error")
)

func checkForErr(doc *goquery.Document) error {
	if doc.Find("form").Length() > 0 {
		return nil
	}

	keyword := getText(doc.Find("font"))
	switch keyword {
	case "ไม่พบรายวิชา":
		return ErrNotFound
	case "ระบบยังไม่พร้อมใช้งานในขณะนี้ กรุณาทำรายการใหม่อีกครั้ง":
		return ErrNotReady
	case "ไม่มีการส่งค่าพารามิเตอร์":
		return ErrNoParams
	default:
		return fmt.Errorf("%w: %s", ErrUnknown, keyword)
	}
}
