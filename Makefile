.PHONY: help build up down restart logs clean deploy

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker images
	docker-compose -f docker-compose.prod.yml build

up: ## Start services in production mode
	docker-compose -f docker-compose.prod.yml up -d

down: ## Stop services
	docker-compose -f docker-compose.prod.yml down

restart: ## Restart services
	docker-compose -f docker-compose.prod.yml restart

logs: ## View logs
	docker-compose -f docker-compose.prod.yml logs -f

logs-nextjs: ## View Next.js logs
	docker-compose -f docker-compose.prod.yml logs -f nextjs

logs-nginx: ## View Nginx logs
	docker-compose -f docker-compose.prod.yml logs -f nginx

clean: ## Remove containers and volumes
	docker-compose -f docker-compose.prod.yml down -v

rebuild: ## Rebuild and restart services
	docker-compose -f docker-compose.prod.yml up -d --build

deploy: ## Full deployment (build and start)
	make build
	make up

status: ## Check container status
	docker-compose -f docker-compose.prod.yml ps

health: ## Check health endpoints
	@echo "Checking Next.js health..."
	@curl -s http://localhost:3000/health || echo "Next.js not responding"
	@echo "\nChecking Nginx health..."
	@curl -s http://localhost/health || echo "Nginx not responding"

dev: ## Start development environment
	docker-compose -f docker-compose.dev.yml up

dev-down: ## Stop development environment
	docker-compose -f docker-compose.dev.yml down
