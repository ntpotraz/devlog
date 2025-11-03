package main

import (
	"database/sql"
	"devlog/server/internal/database"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
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
	clerkSK := os.Getenv("CLERK_SECRET_KEY")
	if clerkSK == "" {
		log.Fatal("CLERK_SECRET_KEY is not set")
	}

	clerk.SetKey(clerkSK)

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

	mux.HandleFunc("GET /api/entries/{id}", apiCfg.handleGetPublicEntry)
	mux.HandleFunc("POST /api/entries", func(w http.ResponseWriter, r *http.Request) {
		handler := clerkhttp.WithHeaderAuthorization()(http.HandlerFunc(apiCfg.handleAddEntry))
		handler.ServeHTTP(w, r)
	})
	mux.HandleFunc("PUT /api/entries", func(w http.ResponseWriter, r *http.Request) {
		handler := clerkhttp.WithHeaderAuthorization()(http.HandlerFunc(apiCfg.handleDeleteEntry))
		handler.ServeHTTP(w, r)
	})
	mux.HandleFunc("GET /api/entries", func(w http.ResponseWriter, r *http.Request) {
		handler := clerkhttp.WithHeaderAuthorization()(http.HandlerFunc(apiCfg.handleGetUserEntries))
		handler.ServeHTTP(w, r)
	})
	mux.HandleFunc("PATCH /api/entries/{id}", func(w http.ResponseWriter, r *http.Request) {
		handler := clerkhttp.WithHeaderAuthorization()(http.HandlerFunc(apiCfg.handleUpdateEntry))
		handler.ServeHTTP(w, r)
	})
	mux.HandleFunc("/health", handleHealthCheck)

	spaHandler := func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(dist, filepath.Clean(r.URL.Path))
		if info, err := os.Stat(path); err == nil && !info.IsDir() && r.URL.Path != "/" {
			fileServer.ServeHTTP(w, r)
			return
		}
		indexPath := filepath.Join(dist, "index.html")
		http.ServeFile(w, r, indexPath)
	}
	mux.HandleFunc("/", spaHandler)

	server := http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Println("Starting server...")

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
