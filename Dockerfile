# Build stage
FROM oven/bun:1 AS frontend-builder
WORKDIR /app
COPY . .
RUN bun install && bun run build

# Go build stage
FROM golang:1.24-alpine AS go-builder
WORKDIR /app
COPY server/ ./server/
RUN cd server && go build -o devlog-server .

# Runtime stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app
COPY --from=go-builder /app/server/devlog-server ./devlog-server
COPY --from=frontend-builder /app/dist ./dist/
EXPOSE 8080
ENV PORT=8080
ENV DIST=./dist

CMD ["./devlog-server"]
