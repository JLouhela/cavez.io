setup:
	docker volume create nodemodules
install:
	npm install && docker-compose -f docker-compose.yml run --rm install
dev:
	npm run tsc && docker-compose up

