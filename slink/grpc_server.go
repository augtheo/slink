package main

import (
	"context"
	"fmt"
	"log"
	"net"

	pb "github.com/augtheo/slink/proto"
	"google.golang.org/grpc"
)

const (
	GRPC_DEFAULT_PORT = 50051
)

type server struct {
	pb.UnimplementedUrlShortenerServer
}

func (s *server) Shorten(ctx context.Context, in *pb.ShortenRequest) (*pb.ShortenResponse, error) {
	log.Printf("Received: %v", in.GetOriginalUrl())
	return &pb.ShortenResponse{ShortenedUrl: getShortenedUrl(in.GetOriginalUrl())}, nil
}

func (s *server) Expand(ctx context.Context, in *pb.ExpandRequest) (*pb.ExpandResponse, error) {
	return &pb.ExpandResponse{OriginalUrl: getExpandedUrl(in.GetShortenedUrl())}, nil
}

func initGrpcServer() {

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", GRPC_DEFAULT_PORT))
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
