package main

import (
	"log"
	"net/http"
		"os"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Printf("Warning: .env file not found, using environment variables: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT is not set")
	}

	static := os.Getenv("STATIC")
	if _, err := os.Stat(static); os.IsNotExist(err) {
		log.Fatalf("Static files directory does not exist: %v", err)
	}

	mux := http.NewServeMux()
	fileServer := http.FileServer(http.Dir(static))

	mux.Handle("/", fileServer)
	mux.HandleFunc("/health", handleHealthCheck)

	server := http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Printf("Running server on port %s...\n", port)
	log.Fatal(server.ListenAndServe())
}
