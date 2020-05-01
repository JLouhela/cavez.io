install:
	sudo docker-compose -f docker-compose.yml run --rm install
dev:
	sudo docker-compose up
setup:
	sudo docker volume create nodemodules
