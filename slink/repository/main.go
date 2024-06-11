package repository

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	"github.com/augtheo/slink/models"
	_ "github.com/lib/pq"
)

var db *sql.DB
var err error

func init() {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"), os.Getenv("DB_NAME"))
	db, err = sql.Open("postgres", psqlInfo)

}

func FindByShortenedUrl(shortenedUrl string) (*Url, error) {
	var url Url
	query := `SELECT id, original_url, shortened_url, expiry_date, user_id FROM urls WHERE shortened_url=$1 AND expiry_date > NOW();`
	if err := db.QueryRow(query, shortenedUrl).Scan(&url.ID, &url.OriginalURL, &url.ShortenedURL, &url.ExpiryDate, &url.UserID); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &url, nil
}

// CreateURL inserts a new URL record into the database and returns the newly created ID.
func CreateURL(shortURL string, originalURL string, expiryDate time.Time, userID string) (int, error) {
	query := `INSERT INTO urls (shortened_url, original_url, expiry_date, user_id)
              VALUES ($1, $2, $3, $4) RETURNING id`
	var id int
	err := db.QueryRow(query, shortURL, originalURL, expiryDate, userID).Scan(&id)
	if err != nil {
		return -1, fmt.Errorf("failed to create URL: %w", err)
	}
	return id, nil
}

// DeleteShortenedUrl deactivates a URL record in the database and returns the deleted ID.
func DeleteShortenedUrl(shortenedUrl string, userId string) (int, error) {
	query := `UPDATE urls SET expiry_date = NOW() WHERE shortened_url=$1 AND user_id=$2 RETURNING id`
	var id int
	err := db.QueryRow(query, shortenedUrl, userId).Scan(&id)
	if err != nil {
		return -1, fmt.Errorf("failed to delete URL: %w", err)
	}
	return id, nil
}

func AddVisit(visitorIp string, urlId int) error {
	query := `INSERT INTO visits (visitor_ip,  url_id , visit_timestamp) VALUES ($1 , $2 , NOW() )`
	if _, err := db.Exec(query, visitorIp, urlId); err != nil {
		return err
	}
	return nil
}

func GetUrlShortenedStats(shortenedUrl string, userId string) (*models.UrlStatsResponse, error) {
	query := `SELECT COUNT(V.visitor_ip) , COUNT(DISTINCT(V.visitor_ip)) FROM urls U JOIN visits V ON V.url_id=U.id WHERE U.shortened_url=$1 GROUP BY V.url_id;`
	var urlStats models.UrlStatsResponse
	if err := db.QueryRow(query, shortenedUrl).Scan(&urlStats.TotalVisits, urlStats.UniqueVisits); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &urlStats, nil
}

func GetUserStats(userId string) ([]models.UserStatsResponseTopUrlsInner, error) {
	query := `SELECT U.id , U.original_url , U.shortened_url , COUNT(V.visitor_ip) as clicks , COUNT(DISTINCT(V.visitor_ip)) as unique_clicks FROM urls U JOIN visits V ON V.url_id=U.id WHERE U.user_id=$1 GROUP BY U.id;`

	rows, err := db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var userStats []models.UserStatsResponseTopUrlsInner

	for rows.Next() {
		var userUrlStat models.UserStatsResponseTopUrlsInner
		if err := rows.Scan(&userUrlStat.UrlId, &userUrlStat.OriginalUrl, &userUrlStat.ShortenedUrl, &userUrlStat.TotalVisits, &userUrlStat.UniqueVisits); err != nil {
			return nil, err
		}
		userStats = append(userStats, userUrlStat)
	}

	if err = rows.Err(); err != nil {
		return userStats, err
	}
	return userStats, nil

}

func GetLastWeekUniqueVisitCountStats(userId string) int {

	query :=
		`SELECT COUNT(DISTINCT V.visitor_ip)
  FROM 
      visits V
  JOIN 
    urls U 
  ON 
    U.id=V.url_id
  WHERE 
      V.visit_timestamp >= NOW() - INTERVAL '7 days'
      AND U.user_id = $1`

	var id int
	if err := db.QueryRow(query, userId).Scan(&id); err == nil {
		return id
	} else {
		return -1
	}
}

func GetLastWeekUniqueVisitStats(userId string) ([]models.UserClickStatsResponseDataInner, error) {

  query :=
  `SELECT 
    TO_CHAR(V.visit_timestamp, 'DD/MM') AS name,
    COUNT(DISTINCT V.visitor_ip) AS count
  FROM 
      visits V
  JOIN 
    urls U 
  ON 
    U.id=V.url_id 
  WHERE 
      V.visit_timestamp >= NOW() - INTERVAL '7 days'
      AND U.user_id = $1
  GROUP BY 
      TO_CHAR(V.visit_timestamp, 'DD/MM')
  ORDER BY 
      name;`

	rows, err := db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clickStats []models.UserClickStatsResponseDataInner

	for rows.Next() {
		var clickStat models.UserClickStatsResponseDataInner
		if err := rows.Scan(&clickStat.Name, &clickStat.Count); err != nil {
			return nil, err
		}
		clickStats = append(clickStats, clickStat)
	}

	if err = rows.Err(); err != nil {
		return clickStats, err
	}
	return clickStats, nil

}

func GetLastWeekTotalVisitCountStats(userId string) int {

  query :=
  `SELECT COUNT(V.visitor_ip)
  FROM 
      visits V
  JOIN 
    urls U 
  ON 
    U.id=V.url_id
  WHERE 
      V.visit_timestamp >= NOW() - INTERVAL '7 days'
      AND U.user_id = $1`

	var id int
	if err := db.QueryRow(query, userId).Scan(&id); err == nil {
		return id
	} else {
		return -1
	}
}

func GetLastWeekTotalVisitStats(userId string) ([]models.UserClickStatsResponseDataInner, error) {

  query :=
  `SELECT 
    TO_CHAR(V.visit_timestamp, 'DD/MM') AS name,
    COUNT(V.visitor_ip) AS count
  FROM 
      visits V
  JOIN 
    urls U 
  ON 
    U.id=V.url_id 
  WHERE 
      V.visit_timestamp >= NOW() - INTERVAL '7 days'
      AND U.user_id = $1
  GROUP BY 
      TO_CHAR(V.visit_timestamp, 'DD/MM')
  ORDER BY 
      name;`

	rows, err := db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clickStats []models.UserClickStatsResponseDataInner

	for rows.Next() {
		var clickStat models.UserClickStatsResponseDataInner
		if err := rows.Scan(&clickStat.Name, &clickStat.Count); err != nil {
			return nil, err
		}
		clickStats = append(clickStats, clickStat)
	}

	if err = rows.Err(); err != nil {
		return clickStats, err
	}
	return clickStats, nil

}
