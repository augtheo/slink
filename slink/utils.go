package main

import (
	_ "embed"
	"fmt"
	"os"
)

//go:embed resources/clerk_prd.pem
var prdRsaPubKey string

//go:embed resources/clerk_dev.pem
var devRsaPubKey string

func loadRSAPublicKey() string {
	profile := os.Getenv("profile")

	switch profile {
	case "prd":
		return prdRsaPubKey
	case "dev":
		return devRsaPubKey
	default:
		panic(fmt.Errorf("unsupported profile: %s", profile))
	}
}
