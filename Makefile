tags:
	ctags -R index.html src
.PHONY: tags

clean:
	rm -rf bld/*
.PHONY: clean
