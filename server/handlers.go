package main

import (
	"devlog/server/internal/database"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/google/uuid"
)

func handleHealthCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

type Entry struct {
	Id        string `json:"id"`
	UserID    string `json:"userID"`
	Body      string `json:"body"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
	IsDeleted int64  `json:"isDeleted"`
}

func getEntryStruct(body io.ReadCloser) Entry {
	var entryStruct Entry

	if err := json.NewDecoder(body).Decode(&entryStruct); err != nil {
		log.Printf("Error decoding: %v", err)
		return Entry{}
	}

	return entryStruct
}

func getUser(w http.ResponseWriter, r *http.Request) *clerk.User {
	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"access": "unauthorized"}`))
		return nil
	}

	usr, err := user.Get(r.Context(), claims.Subject)
	if err != nil {
		http.Error(w, "error getting user", http.StatusInternalServerError)
		return nil
	}
	return usr
}

func (cfg *apiConfig) handleAddEntry(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling Add Entry")

	user := getUser(w, r)
	if user == nil {
		return
	}

	entryStruct := getEntryStruct(r.Body)

	entryID := uuid.New().String()
	now := time.Now().UTC().Format(time.DateTime)

	entryParams := database.CreateEntryParams{
		ID:        entryID,
		Userid:    user.ID,
		Body:      entryStruct.Body,
		Createdat: now,
		Updatedat: now,
		Isdeleted: 0,
	}
	if err := cfg.DB.CreateEntry(r.Context(), entryParams); err != nil {
		log.Printf("Entry could not be created: %v", err)
		http.Error(w, "Failed to create entry", http.StatusInternalServerError)
		return
	}

	resEntry := Entry{
		Id:        entryID,
		UserID:    user.ID,
		Body:      entryStruct.Body,
		CreatedAt: now,
		UpdatedAt: now,
		IsDeleted: 0,
	}

	respondWithJSON(w, http.StatusCreated, resEntry)
}

func (cfg *apiConfig) handleDeleteEntry(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling Delete Entry")

	user := getUser(w, r)
	if user == nil {
		return
	}
	entryStruct := getEntryStruct(r.Body)

	entry, err := cfg.DB.GetEntry(r.Context(), entryStruct.Id)
	if err != nil {
		log.Printf("Error fetching entry: %v", err)
		http.Error(w, "Entry not found", http.StatusNotFound)
		return
	}

	if user.ID != entry.Userid {
		log.Println("Unauthorized deletion attempt")
		http.Error(w, "Unauthorized", http.StatusForbidden)
		return
	}

	deleteParams := database.DeleteEntryParams{
		ID:        entryStruct.Id,
		Updatedat: time.Now().UTC().Format(time.DateTime),
		Isdeleted: 1,
	}

	if err := cfg.DB.DeleteEntry(r.Context(), deleteParams); err != nil {
		log.Printf("Entry could not be deleted: %v", err)
		http.Error(w, "Failed to delete entry", http.StatusInternalServerError)
		return
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

	user := getUser(w, r)

	dbEntries, err := cfg.DB.GetUserEntries(r.Context(), user.ID)
	if err != nil {
		log.Printf("Couldn't fetch user entries: %v", err)
	}
	entries := []Entry{}
	for _, dbEntry := range dbEntries {
		dbID, err := uuid.Parse(dbEntry.ID)
		if err != nil {
			log.Printf("invalid userid: %v", err)
		}

		dbCreatedAt, err := time.Parse(time.DateTime, dbEntry.Createdat)
		if err != nil {
			log.Printf("invalid Createdtime: %v", err)
		}
		dbUpdatedAt, err := time.Parse(time.DateTime, dbEntry.Updatedat)
		if err != nil {
			log.Printf("invalid Updatetime: %v", err)
		}

		entries = append(entries, Entry{
			Id:        dbID.String(),
			UserID:    dbEntry.Userid,
			Body:      dbEntry.Body,
			CreatedAt: dbCreatedAt.Local().Format(time.DateTime),
			UpdatedAt: dbUpdatedAt.Local().Format(time.DateTime),
		})
	}

	respondWithJSON(w, http.StatusOK, entries)
}

func (cfg *apiConfig) handleUpdateEntry(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	user := getUser(w, r)
	if user == nil {
		http.Error(w, "Unauthorized", http.StatusForbidden)
		return
	}

	entry, err := cfg.DB.GetEntry(r.Context(), id)
	if err != nil {
		log.Printf("Error fetching entry: %v", err)
		http.Error(w, "Entry not found", http.StatusNotFound)
		return
	}

	if user.ID != entry.Userid {
		log.Println("Unauthorized update attempt")
		http.Error(w, "Unauthorized", http.StatusForbidden)
		return
	}

	entryStruct := getEntryStruct(r.Body)

	entryID := uuid.New().String()
	updatedAt := time.Now().UTC().Format(time.DateTime)

	updateParams := database.CreateEntryParams{
		ID:        entryID,
		Userid:    user.ID,
		Body:      entryStruct.Body,
		Createdat: entry.Createdat,
		Updatedat: updatedAt,
		Isdeleted: 0,
	}
	if err := cfg.DB.CreateEntry(r.Context(), updateParams); err != nil {
		log.Printf("Entry could not be updated: %v", err)
		http.Error(w, "Failed to update entry", http.StatusInternalServerError)
		return
	}

	deleteParams := database.DeleteEntryParams{
		ID:        id,
		Updatedat: updatedAt,
		Isdeleted: 1,
	}

	if err := cfg.DB.DeleteEntry(r.Context(), deleteParams); err != nil {
		log.Printf("Entry could not be deleted: %v", err)
	}

	resEntry := Entry{
		Id:        entryID,
		UserID:    user.ID,
		Body:      entryStruct.Body,
		CreatedAt: entry.Createdat,
		UpdatedAt: updatedAt,
	}

	respondWithJSON(w, http.StatusOK, resEntry)
}

func (cfg *apiConfig) handleGetPublicEntry(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	entry, err := cfg.DB.GetEntry(r.Context(), id)
	if err != nil {
		log.Printf("Error fetching entry: %v", err)
		http.Error(w, "Entry not found", http.StatusNotFound)
		return
	}

	dbCreatedAt, err := time.Parse(time.DateTime, entry.Createdat)
	if err != nil {
		log.Printf("invalid Createdtime: %v", err)
	}
	dbUpdatedAt, err := time.Parse(time.DateTime, entry.Updatedat)
	if err != nil {
		log.Printf("invalid Updatetime: %v", err)
	}

	resEntry := Entry{
		Id:        entry.ID,
		UserID:    entry.Userid,
		Body:      entry.Body,
		CreatedAt: dbCreatedAt.Local().Format(time.DateTime),
		UpdatedAt: dbUpdatedAt.Local().Format(time.DateTime),
		IsDeleted: entry.Isdeleted,
	}

	respondWithJSON(w, http.StatusOK, resEntry)
}
