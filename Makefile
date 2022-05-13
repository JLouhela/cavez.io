setup:
	docker volume create nodemodules && \
	npm install && \
	docker-compose -f docker-compose_dev.yml run --rm install && \
	docker-compose -f docker-compose_dev.yml run compile
dev:
	docker-compose -f docker-compose_dev.yml up
prod:
	docker build . -t cavez_prod && \
	docker-compose -f docker-compose.yml up -d
kill:
	docker-compose -f docker-compose.yml stop && \
	docker-compose -f docker-compose_dev.yml stop && \
	docker-compose -f docker-compose.yml down && \
	docker-compose -f docker-compose_dev.yml down 
