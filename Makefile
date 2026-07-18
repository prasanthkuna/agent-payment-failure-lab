.PHONY: setup test lab failure-lab ci

setup:
	npm install

test:
	npm test

lab:
	npm run lab

failure-lab: test lab

ci: test lab
