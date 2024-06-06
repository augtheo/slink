package repository

import (
	"database/sql"
	"time"
)

type Url struct {
	ID           int
	OriginalURL  string
	ShortenedURL string
	ExpiryDate   time.Time
	UserID       sql.NullString
}
