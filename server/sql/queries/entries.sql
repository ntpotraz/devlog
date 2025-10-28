-- name: CreateEntry :exec
INSERT INTO entries (id, userID, body, createdAt, updatedAt, isDeleted)
VALUES (?, ?, ?, ?, ?, ?);

-- name: GetEntry :one
SELECT * FROM entries WHERE id = ?;

-- name: GetUserEntries :many
SELECT * FROM entries WHERE userID = ? AND isDeleted = 0;

-- name: DeleteEntry :exec
UPDATE entries
SET isDeleted = ?, updatedAt = ?
WHERE id = ?;
