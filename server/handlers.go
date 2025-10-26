package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

func handleHealthCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

type Note struct {
	Id        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"userID"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	IsDeleted bool      `json:"isDeleted"`
}

func handleAddEntry(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling Add Entry")

	var noteStruct Note

	if err := json.NewDecoder(r.Body).Decode(&noteStruct); err != nil {
		log.Fatalf("Error decoding: %v", err)
		return
	}

	log.Println(noteStruct)
}
