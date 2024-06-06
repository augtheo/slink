package service

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/augtheo/slink/repository"
)

const (
	K              = 6
	CACHE_CAPACITY = 1000
)

var (
	BASE_URL = os.Getenv("BASE_URL")
	cache    = CreateLRUCache(CACHE_CAPACITY)
)

func getShortHash(originalUrl string, expiryDate string) string {
	md5Sum := md5.Sum([]byte(originalUrl + expiryDate))
	md5Hash := hex.EncodeToString(md5Sum[:])

	var shortened_hash string

	if K >= len(md5Hash) {
		shortened_hash = md5Hash
	} else {
		startIndex := len(md5Hash) - K
		shortened_hash = md5Hash[startIndex:]
	}

	return shortened_hash
}

func GetShortenedUrl(originalUrl string, expiryDate time.Time, userId string) string {

	shortenedUrl := getShortHash(originalUrl, expiryDate.String())
	if id, err := repository.CreateURL(shortenedUrl, originalUrl, expiryDate, userId); err == nil {
		go cache.Put(shortenedUrl, Node{urlId: id, expandedUrl: originalUrl})
		return fmt.Sprintf("%v/%v", BASE_URL, shortenedUrl)
	} else {
		log.Fatal(err)
		return ""
	}
}

func ResolveShortenedUrl(shortenedUrl string, visitorIp string) string {
	if cacheUrl, err := cache.Get(shortenedUrl); err == nil {
		_ = repository.AddVisit(visitorIp, cacheUrl.urlId)
		return cacheUrl.expandedUrl
	}
	if url, err := repository.FindByShortenedUrl(shortenedUrl); err == nil {
		_ = repository.AddVisit(visitorIp, url.ID)
		return url.OriginalURL
	}
	return fmt.Sprintf("%v/app/error", BASE_URL)
}

