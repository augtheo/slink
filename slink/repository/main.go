package repository

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var db *sql.DB
var err error

func init() {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"), os.Getenv("DB_NAME"))
	db, err = sql.Open("postgres", psqlInfo)

	if _, err := db.Exec(`CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    original_url VARCHAR(1024) NOT NULL,
    shortened_url VARCHAR(512) NOT NULL)`,
	); err != nil {
		log.Fatal("Error creating table ", psqlInfo, err)
	}
}

func initTable(shortenedUrl string, originalUrl string) error {
	sqlStatement := `INSERT INTO urls (shortened_url,  original_url) VALUES ($1 , $2)`
	if _, err := db.Exec(sqlStatement, shortenedUrl, originalUrl); err != nil {
		return err
	}
	return nil
}

type Url struct {
	OriginalUrl  string
	ShortenedUrl string
}

func FindByOriginalUrl(originalUrl string) (*Url, error) {
	var u Url
	query := `SELECT shortened_url FROM urls WHERE original_url=$1;`
	if err := db.QueryRow(query, originalUrl).Scan(&u.ShortenedUrl); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func FindByShortenedUrl(shortenedUrl string) (*Url, error) {
	var u Url
	query := `SELECT original_url FROM urls WHERE shortened_url=$1;`
	if err := db.QueryRow(query, shortenedUrl).Scan(&u.OriginalUrl); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func Create(shortenedUrl string, originalUrl string) error {
	sqlStatement := `INSERT INTO urls (shortened_url,  original_url) VALUES ($1 , $2)`
	if _, err := db.Exec(sqlStatement, shortenedUrl, originalUrl); err != nil {
		return err
	}
	return nil
}
