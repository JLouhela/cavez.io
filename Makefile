install:
	docker-compose -f docker-compose.yml run --rm install
dev:
	docker-compose up
setup:
	npm run tsc && docker volume create nodemodules
