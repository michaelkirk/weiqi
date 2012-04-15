// export a function that passes in the espress instance and the session store
module.exports = function(app, sessionStore) {

  // convenience function that looks up our user's session
  // by default, socket.io has no notion of a user's session
  var bind_session = function(handshakeData, successCallback){

  }

	var parseCookie = require('connect').utils.parseCookie;
	var io = require('socket.io').listen(app);

  // basic configuration
	io.configure(function () {
		io.set('log level', 0);
    // heroku supports xhr-polling only?
    // https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
    // io.set("transports", ["xhr-polling"]); 
    // io.set("polling duration", 3); 
	});


  // setting up a default namespace, for now we can accept all connections
	io.of('/').authorization(function(handshakeData, successCallback) {
    console.log(handshakeData)
		var cookies = parseCookie(handshakeData.headers.cookie);
		sessionStore.get(cookies['connect.sid'], function(err, sessionData) {
			handshakeData.session = sessionData; // || {};
			handshakeData.sid = cookies['connect.sid']|| null;
			successCallback(err, err ? false : true);
		});
	});

	io.of('/').on('connection', function(socket) {
		var user = socket.handshake.session.user ? socket.handshake.session.user.name : 'UID: '+(socket.handshake.session.uid || 'has no UID');

		// Join user specific channel, this is good so content is sent across user tabs.
    //
		socket.join(socket.handshake.sid);

		socket.send('welcome: '+user);

		socket.on('message', function(msg) {
			// Send bsuccessCallback the message to the users room.
			io.sockets.in(socket.handshake.sid).send('socket.io relay message "'+msg+'" from: '+ user +' @ '+new Date().toString().match(/[0-9]+:[0-9]+:[0-9]+/));
		});

		socket.on('disconnect', function() { console.log('disconnect'); });
	});

	io.sockets.on('error', function(){ console.log(arguments); });

  // https://github.com/LearnBoost/socket.io/wiki/Authorizing
	io.of('/game').authorization(function(handshakeData, successCallback) {
    console.log(handshakeData)
		var cookies = parseCookie(handshakeData.headers.cookie);
    // above, the assumption is that if a persion has a session id
    // then they can connect globally. Fine. But if a user wants to 
    // connect to a game, they must at least limit themselves to a 
    // game channel. Later, the session ids must not be given out so 
    // freely ;)

		sessionStore.get(cookies['connect.sid'], function(err, sessionData) {
			handshakeData.session = sessionData || {};
			handshakeData.sid = cookies['connect.sid']|| null;
			successCallback(err, err ? false : true);
		});

	}).on('connection', function (socket) {
      console.dir("a game connection was made!");

  });






	return io;
};
