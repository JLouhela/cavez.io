install:
	docker volume create nodemodules && docker-compose -f docker-compose.yml run --rm install && docker-compose -f docker-compose.yml run compile
dev:
	docker-compose -f docker-compose_dev.yml up
prod:
	docker-compose -f docker-compose.yml up
