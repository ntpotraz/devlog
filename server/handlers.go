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
	Id        uuid.UUID `json:"id"`
	UserID    string    `json:"userID"`
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

	entryParams := database.CreateEntryParams{
		ID:        uuid.New().String(),
		Userid:    user.ID,
		Body:      entryStruct.Body,
		Createdat: time.Now().UTC().Format(time.DateTime),
		Updatedat: time.Now().UTC().Format(time.DateTime),
		Isdeleted: 0,
	}
	if err := cfg.DB.CreateEntry(r.Context(), entryParams); err != nil {
		log.Fatalf("Entry could not be created: %v", err)
		http.Error(w, "Failed to create entry", http.StatusInternalServerError)
		return
	}

	entryStruct.CreatedAt = time.Now().UTC()
	entryStruct.UpdatedAt = time.Now().UTC()

	respondWithJSON(w, http.StatusCreated, entryStruct)
}

func (cfg *apiConfig) handleDeleteEntry(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling Delete Entry")

	user := getUser(w, r)
	if user == nil {
		return
	}
	entryStruct := getEntryStruct(r.Body)

	entry, err := cfg.DB.GetEntry(r.Context(), entryStruct.Id.String())
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
		ID:        entryStruct.Id.String(),
		Updatedat: time.Now().UTC().Format(time.DateTime),
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

	user := getUser(w, r)
	log.Println("USER ID:", user.ID)

	dbEntries, err := cfg.DB.GetUserEntries(r.Context(), user.ID)
	if err != nil {
		log.Printf("Couldn't fetch user entries: %v", err)
	}
	entries := []Entry{}
	for _, dbEntry := range dbEntries {
		dbID, err := uuid.Parse(dbEntry.ID)
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
			UserID:    dbEntry.Userid,
			Body:      dbEntry.Body,
			CreatedAt: dbCreatedAt,
			UpdatedAt: dbUpdatedAt,
		})
	}

	log.Println(entries)
	respondWithJSON(w, http.StatusOK, entries)
}
