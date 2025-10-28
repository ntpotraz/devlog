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

type Entry struct {
	Id        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"userID"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	IsDeleted bool      `json:"isDeleted"`
}

func getEntryStruct(w http.ResponseWriter, r *http.Request) Entry {
	var entryStruct Entry

	if err := json.NewDecoder(r.Body).Decode(&entryStruct); err != nil {
		log.Fatalf("Error decoding: %v", err)
		return Entry{}
	}

	return entryStruct
}

func (cfg *apiConfig) handleAddEntry(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling Add Entry")

	entryStruct := getEntryStruct(w, r)

	var isDeleted int64
	if entryStruct.IsDeleted {
		isDeleted = 1
	} else {
		isDeleted = 0
	}

	entryParams := database.CreateEntryParams{
		ID:        entryStruct.Id.String(),
		Userid:    entryStruct.UserID.String(),
		Body:      entryStruct.Body,
		Createdat: entryStruct.CreatedAt.Format(time.DateTime),
		Updatedat: entryStruct.UpdatedAt.Format(time.DateTime),
		Isdeleted: isDeleted,
	}
	if err := cfg.DB.CreateEntry(context.Background(), entryParams); err != nil {
		log.Fatalf("Entry could not be created: %v", err)
	}
}

func (cfg *apiConfig) handleDeleteEntry(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling Delete Entry")
	entryStruct := getEntryStruct(w, r)

	deleteParams := database.DeleteEntryParams{
		ID:        entryStruct.Id.String(),
		Updatedat: entryStruct.UpdatedAt.Format(time.DateTime),
		Isdeleted: 1,
	}

	if err := cfg.DB.DeleteEntry(context.Background(), deleteParams); err != nil {
		log.Fatalf("Entry could not be deleted: %v", err)
	}

}
