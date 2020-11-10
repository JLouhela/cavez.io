install:
	docker volume create nodemodules && docker-compose -f docker-compose.yml run --rm install && docker-compose -f docker-compose.yml run compile
dev:
	docker-compose up
prod:
	docker-compose -f docker-compose.yml run compile && docker-compose -f docker-compose.yml run build && docker-compose -f docker-compose.yml run start
