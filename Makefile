SHELL = /bin/bash
PHANTOM_BIN = phantomjs-1.7.0-linux-i686/

test: phantom casper
	export PATH=spec/vendor/casperjs/bin:spec/vendor/phantomjs-1.7.0-linux-i686/bin:$$PATH && \
	casperjs test spec/acceptance/board_features.casper.js

phantom:
	if [ ! -d spec/vendor/phantomjs-1.7.0 ]; then \
			mkdir -p spec/vendor ; \
			cd spec/vendor ; \
			if [ ! -f phantomjs-1.7.0-linux-i686.tar.bz2 ]; then \
				wget http://phantomjs.googlecode.com/files/phantomjs-1.7.0-linux-i686.tar.bz2; \
				tar -jxvf phantomjs-1.7.0-linux-i686.tar.bz2; \
			fi; \
	fi 
casper:
	if [ ! -d spec/vendor/casperjs ]; then \
			git clone git://github.com/n1k0/casperjs.git spec/vendor/casperjs; \
			cd spec/vendor/casperjs; \
			git checkout tags/1.0.0-RC4; \
	fi 
	 
