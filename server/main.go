package main

import (
	"database/sql"
	"devlog/server/internal/database"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

type apiConfig struct {
	DB *database.Queries
}

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

	apiCfg := apiConfig{}
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Println("DATABASE_URL env is not set")
	} else {
		db, err := sql.Open("libsql", dbURL)
		if err != nil {
			log.Fatal(err)
		}
		dbQueries := database.New(db)
		apiCfg.DB = dbQueries
		log.Println("Connected to database")
	}

	mux := http.NewServeMux()
	fileServer := http.FileServer(http.Dir(dist))

	mux.Handle("/", fileServer)
	mux.HandleFunc("/health", handleHealthCheck)
	mux.HandleFunc("POST /api/entries", apiCfg.handleAddEntry)
	mux.HandleFunc("PUT /api/entries", apiCfg.handleDeleteEntry)

	server := http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Println("Starting server...")

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
