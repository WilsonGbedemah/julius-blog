NPM ?= npm
UV ?= uv
SCRIPT ?=
ARGS ?=

.PHONY: install dev start build preview lint uv-help uv-run

install:
	$(NPM) install

dev: install
	$(NPM) run dev

start: dev

build: install
	$(NPM) run build

preview: install
	$(NPM) run preview

lint: install
	$(NPM) run lint

uv-help:
	@echo Optional Python helper usage with uv:
	@echo make uv-run SCRIPT=tools/example.py
	@echo make uv-run SCRIPT=tools/example.py ARGS="--flag value"

uv-run:
	$(if $(strip $(SCRIPT)),,$(error SCRIPT is required. Use 'make uv-run SCRIPT=path/to/script.py [ARGS="..."]'))
	$(UV) run $(SCRIPT) $(ARGS)
