package main

import (
	"context"
	"devlog/server/internal/database"
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

func (cfg *apiConfig) handleAddEntry(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling Add Entry")

	var noteStruct Note

	if err := json.NewDecoder(r.Body).Decode(&noteStruct); err != nil {
		log.Fatalf("Error decoding: %v", err)
		return
	}

	var isDeleted int64
	if noteStruct.IsDeleted {
		isDeleted = 1
	} else {
		isDeleted = 0
	}

	entryParams := database.CreateEntryParams{
		ID:        noteStruct.Id.String(),
		Userid:    noteStruct.UserID.String(),
		Body:      noteStruct.Body,
		Createdat: noteStruct.CreatedAt.Format(time.DateTime),
		Updatedat: noteStruct.UpdatedAt.Format(time.DateTime),
		Isdeleted: isDeleted,
	}
	if err := cfg.DB.CreateEntry(context.Background(), entryParams); err != nil {
		log.Fatalf("Entry could not be created: %v", err)
	}

	log.Println(noteStruct)
}
