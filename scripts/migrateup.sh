#!/bin/bash

if [ -f .env ]; then
  source .env
fi

cd server/sql/schema
goose turso $DATABASE_URL up
