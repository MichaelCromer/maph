tags:
	ctags -R index.html src
.PHONY: tags

server:
	rm src/server/database
.PHONY: server
