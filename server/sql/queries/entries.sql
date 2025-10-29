-- name: CreateEntry :exec
INSERT INTO entries (id, userID, body, createdAt, updatedAt, isDeleted)
VALUES (?, ?, ?, ?, ?, ?);

-- name: GetEntry :one
SELECT * FROM entries WHERE id = ? LIMIT 1;

-- name: GetUserEntries :many
SELECT * FROM entries
WHERE userID = ?
AND isDeleted = 0
ORDER BY createdAt DESC;

-- name: DeleteEntry :exec
UPDATE entries
SET isDeleted = ?, updatedAt = ?
WHERE id = ?;
