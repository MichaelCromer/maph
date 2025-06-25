db:
	rm -f ./server/database
	node ./server/db.ts

tags:
	ctags -R index.html src
.PHONY: tags

clean:
	rm -rf bld/*
.PHONY: clean
