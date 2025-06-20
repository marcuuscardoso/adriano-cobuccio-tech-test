up:
	docker compose up -d

up-prod:
	docker compose -f docker-compose-prod.yaml up -d

stop:
	docker compose stop

stop-prod:
	docker compose -f docker-compose-prod.yaml stop

down:
	docker compose down

down-prod:
	docker compose -f docker-compose-prod.yaml down

build:
	docker compose up --build -d

build-prod:
	docker compose -f docker-compose-prod.yaml up --build -d
