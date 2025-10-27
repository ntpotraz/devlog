-- +goose Up
CREATE TABLE entries (
  id TEXT PRIMARY KEY,
  userID TEXT NOT NULL,
  body TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  isDeleted INTEGER NOT NULL
);

-- +goose Down
DROP TABLE entries;
