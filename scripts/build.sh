#!/bin/bash
set -e
echo "Building with Bun"
cd frontend
bun install
bun run build
echo "Frontend build completed"

echo " Building Go server"
cd ../server
go build -o devlog-server .
echo "Go server build completed"

mv devlog-server ../
cd ..

echo " Starting server..."
echo "Press Ctrl+C to stop the server"
echo ""

./devlog-server
