#!/bin/bash
set -e
echo "Building with Bun"
bun install
bun run build
echo "Frontend build completed"

echo "Building Go server"
cd server
go build -o devlog-server .
mv devlog-server ..
cd ..
echo "Go server build completed"

echo "Starting server..."
echo "Press Ctrl+C to stop the server"
echo ""

./devlog-server
