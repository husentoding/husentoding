SHELL := /bin/bash
.PHONY: help install dev build start lint clean

help:
	@printf "%s\n" "Available targets:" \
	  "  install  Install dependencies" \
	  "  dev      Run local dev server" \
	  "  build    Build for production" \
	  "  start    Start production server" \
	  "  lint     Run lint checks" \
	  "  clean    Remove build artifacts"

install:
	bun install

dev:
	bun run dev

build:
	bun run build

start:
	bun run start

lint:
	bun run lint

clean:
	rm -rf .next
