test:
	mocha spec/acceptance/*.js --reporter spec -t 10s

debug:
	mocha spec/acceptance/*.js --reporter spec -t 0 --debug-brk

