package repository

import (
	"time"
)

type Visit struct {
	Id             int
	UrlId          int
	VisitorIp      string
	VisitTimestamp time.Time
}
