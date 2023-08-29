package main

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"

	"github.com/augtheo/slink/repository"
)

const (
	K = 6
)

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

func getShortenedUrl(original_url string) string {
	url, err := repository.FindByOriginalUrl(original_url)
	if err != nil {
		fmt.Println(err)
	}
	if url != nil {
		return url.ShortenedUrl
	}

	shortened_url := getShortHash(original_url)
	err = repository.Create(shortened_url, original_url)
	if err != nil {
		fmt.Println(err)
	}
	return shortened_url
}

func getExpandedUrl(shortened_url string) string {
	url, err := repository.FindByShortenedUrl(shortened_url)
	if err != nil {
		fmt.Println(err)
	}

	if url == nil {
		return ""
	} else {
		return url.OriginalUrl
	}
}
