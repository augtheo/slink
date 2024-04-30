package main

import (
	"crypto/md5"
	"encoding/hex"
	"log"

	"github.com/augtheo/slink/repository"
)

const (
	K              = 6
	CACHE_CAPACITY = 1000
)

var cache = CreateLRUCache(CACHE_CAPACITY)

func getShortHash(original_url string) string {
	md5Sum := md5.Sum([]byte(original_url))
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

func getShortenedUrl(original_url string, expiry_date string) string {
	url, err := repository.FindByOriginalUrl(original_url)
	if err != nil {
		log.Fatal(err)
	}
	if url != nil {
		return url.ShortenedUrl
	}

	shortened_url := getShortHash(original_url) //TODO: Include expiry_date in the hash calculation and cache
	err = repository.Create(shortened_url, original_url, expiry_date)
	go cache.Put(shortened_url, original_url)
	if err != nil {
		log.Fatal(err)
	}
	return shortened_url
}

func getExpandedUrl(shortened_url string) string {
	original_url, err := cache.Get(shortened_url)
	if err == nil {
		return original_url
	}
	url, err := repository.FindByShortenedUrl(shortened_url)
	if err != nil {
		log.Fatal(err)
	}

	if url == nil {
		return ""
	} else {
		return url.OriginalUrl
	}
}
