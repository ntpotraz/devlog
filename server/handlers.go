package main

import (
	"devlog/server/internal/database"
	"encoding/json"
	"io"
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

func getEntryStruct(body io.ReadCloser) Entry {
	var entryStruct Entry

	if err := json.NewDecoder(body).Decode(&entryStruct); err != nil {
		log.Fatalf("Error decoding: %v", err)
		return Entry{}
	}

	return entryStruct
}

func (cfg *apiConfig) handleAddEntry(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling Add Entry")

	entryStruct := getEntryStruct(r.Body)

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
	if err := cfg.DB.CreateEntry(r.Context(), entryParams); err != nil {
		log.Fatalf("Entry could not be created: %v", err)
	}
}

func (cfg *apiConfig) handleDeleteEntry(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling Delete Entry")
	entryStruct := getEntryStruct(r.Body)

	deleteParams := database.DeleteEntryParams{
		ID:        entryStruct.Id.String(),
		Updatedat: entryStruct.UpdatedAt.Format(time.DateTime),
		Isdeleted: 1,
	}

	if err := cfg.DB.DeleteEntry(r.Context(), deleteParams); err != nil {
		log.Fatalf("Entry could not be deleted: %v", err)
	}
}

func respondWithJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	dat, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling JSON: %s", err.Error())
		w.WriteHeader(500)
		return
	}
	w.WriteHeader(status)
	w.Write(dat)
	log.Println("Sent payload")
}

func (cfg *apiConfig) handleGetUserEntries(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("userID")

	dbEntries, err := cfg.DB.GetUserEntries(r.Context(), userID)
	if err != nil {
		log.Printf("Couldn't fetch user entries: %v", err)
	}
	entries := []Entry{}
	for _, dbEntry := range dbEntries {
		dbID, err := uuid.Parse(dbEntry.ID)
		if err != nil {
			log.Fatalf("invalid userid: %v", err)
		}
		dbUserID, err := uuid.Parse(dbEntry.Userid)
		if err != nil {
			log.Fatalf("invalid userid: %v", err)
		}
		dbCreatedAt, err := time.Parse(time.DateTime, dbEntry.Createdat)
		if err != nil {
			log.Fatalf("invalid Createdtime: %v", err)
		}
		dbUpdatedAt, err := time.Parse(time.DateTime, dbEntry.Updatedat)
		if err != nil {
			log.Fatalf("invalid Updatetime: %v", err)
		}

		entries = append(entries, Entry{
			Id:        dbID,
			UserID:    dbUserID,
			Body:      dbEntry.Body,
			CreatedAt: dbCreatedAt,
			UpdatedAt: dbUpdatedAt,
		})
	}

	respondWithJSON(w, http.StatusOK, entries)
}
