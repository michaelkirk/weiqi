test:
	mocha --recursive spec/lib/  --reporter spec

acceptance:
	mocha spec/acceptance/*.js --reporter spec -t 10s

debug:
	mocha --recursive spec/lib/  --reporter spec  -t 0 --debug-brk

debug_acceptance:
	mocha spec/acceptance/*.js --reporter spec -t 0 --debug-brk

server:
	node-supervisor app.js

debug_server:
	node-supervisor --debug app.js 

