package main

func main() {
	go initHttpServer()
	initGrpcServer()
}
