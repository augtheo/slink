package main

import (
	"context"
	"crypto/md5"
	"database/sql"
	"encoding/hex"
	"flag"
	"fmt"
	"log"
	"net"

	_ "github.com/lib/pq"

	pb "github.com/augtheo/slink/slink"
	"google.golang.org/grpc"
)

const (
	HOST     = "localhost"
	PORT     = 5432
	USER     = "slink"
	PASSWORD = "tq"
	DB_NAME  = "slinkdb"

	K                 = 6
	GRPC_DEFAULT_PORT = 50051
)

var (
	grpc_port = flag.Int("port", GRPC_DEFAULT_PORT, "The server port")
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

func getShortenedUrl(urlRepo *UrlRepository, original_url string) string {
	url, err := urlRepo.FindByOriginalUrl(original_url)
	if err != nil {
		panic(err)
	}
	if url != nil {
		return url.ShortenedUrl
	}

	shortened_url := getShortHash(original_url)
	err = urlRepo.Create(shortened_url, original_url)
	if err != nil {
		panic(err)
	}
	return shortened_url
}

func getExpandedUrl(urlRepo *UrlRepository, shortened_url string) *pb.ExpandResponse {
	url, err := urlRepo.FindByShortenedUrl(shortened_url)
	if err != nil {
		panic(err)
	}

	if url == nil {
		return &pb.ExpandResponse{
			OriginalUrl: "",
			Status:      pb.StatusCode_NOT_FOUND,
		}
	} else {
		return &pb.ExpandResponse{
			OriginalUrl: url.OriginalUrl,
			Status:      pb.StatusCode_SUCCESS,
		}
	}
}

// repository begin
func init_db() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		HOST, PORT, USER, PASSWORD, DB_NAME)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	return db
}

type Url struct {
	OriginalUrl  string
	ShortenedUrl string
}

type UrlRepository struct {
	db *sql.DB
}

// Any option other than global variables ?
var urlRepo *UrlRepository

func (r *UrlRepository) FindByOriginalUrl(original_url string) (*Url, error) {
	var u Url
	query := `SELECT shortened_url FROM urls WHERE original_url=$1;`
	if err := r.db.QueryRow(query, original_url).Scan(&u.ShortenedUrl); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *UrlRepository) FindByShortenedUrl(shortened_url string) (*Url, error) {
	var u Url
	query := `SELECT original_url FROM urls WHERE shortened_url=$1;`
	if err := r.db.QueryRow(query, shortened_url).Scan(&u.OriginalUrl); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *UrlRepository) Create(shortened_url string, original_url string) error {
	sqlStatement := `INSERT INTO urls (shortened_url,  original_url) VALUES ($1 , $2)`
	if _, err := r.db.Exec(sqlStatement, shortened_url, original_url); err != nil {
		return err
	}
	return nil
}

// repository end

// grpc server methods begin

type server struct {
	pb.UnimplementedUrlShortenerServer
}

func (s *server) Shorten(ctx context.Context, in *pb.ShortenRequest) (*pb.ShortenResponse, error) {
	log.Printf("Received: %v", in.GetOriginalUrl())
	return &pb.ShortenResponse{ShortenedUrl: getShortenedUrl(urlRepo, in.GetOriginalUrl())}, nil
}

func (s *server) Expand(ctx context.Context, in *pb.ExpandRequest) (*pb.ExpandResponse, error) {
	return getExpandedUrl(urlRepo, in.GetShortenedUrl()), nil
}

// grpc server methods end

func main() {
	flag.Parse()
	db := init_db()
	defer db.Close()

	urlRepo = &UrlRepository{
		db: db,
	}

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *grpc_port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterUrlShortenerServer(s, &server{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
