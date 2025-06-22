tags:
	ctags -R index.html src
.PHONY: tags

clean:
	rm -f tmp/database
.PHONY: clean
