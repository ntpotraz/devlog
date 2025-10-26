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

	dist := os.Getenv("DIST")
	if _, err := os.Stat(dist); os.IsNotExist(err) {
		log.Fatalf("Dist files directory does not exist: %v", err)
	}

	mux := http.NewServeMux()
	fileServer := http.FileServer(http.Dir(dist))

	mux.Handle("/", fileServer)
	mux.HandleFunc("/health", handleHealthCheck)
	mux.HandleFunc("POST /api/entries", handleAddEntry)

	server := http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Println("Starting server...")

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
