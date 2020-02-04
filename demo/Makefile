.PHONY: demo build run dev

build:
	docker build --rm -t sonny/lighthouse-demo .

run:
	docker run --rm sonny/lighthouse-demo npm start

dev:
	docker run -it --rm -v ${PWD}:/demo sonny/lighthouse-demo /bin/bash

demo: build run
