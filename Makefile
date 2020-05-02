install:
	docker-compose -f docker-compose.yml run --rm install
dev:
	docker-compose up
setup:
	docker volume create nodemodules
