.PHONY: default build run install dev

# Commands for local development
build:
	docker build --rm -t sonny/lighthouse-demo .

run:
	docker run --rm -it -v ${PWD}:/demo sonny/lighthouse-demo npm start

dev:
	docker run -it --rm -v ${PWD}:/demo sonny/lighthouse-demo /bin/bash

demo: build run
