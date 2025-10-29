# Runtime stage only - builds happen in GitHub Actions
FROM alpine:latest
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app

# Copy pre-built artifacts
COPY dist ./dist
COPY devlog-server .

EXPOSE 8080
ENV PORT=8080
ENV DIST=./app/dist

CMD ["./devlog-server"]
