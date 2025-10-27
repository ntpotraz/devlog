-- name: CreateEntry :exec
INSERT INTO entries (id, userID, body, createdAt, updatedAt, isDeleted)
VALUES (?, ?, ?, ?, ?, ?);

-- name: GetEntry :one
SELECT * FROM entries WHERE id = ?;

-- name: GetUserEntries :many
SELECT * FROM entries WHERE userID = ?;
