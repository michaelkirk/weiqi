module.exports = function(server, sessionStore, redis) {

  // convenience function that looks up our user's session
  // by default, socket.io has no notion of a user's session
  var bind_session = function(handshakeData, successCallback){

  }

	var parseCookie = require('cookie').parse;
	var io = require('socket.io', {
  
    "log level": 5,
    "transports": ["xhr-polling"],
    "polling duration": 1.5
  
  }).listen(server);

  var RedisStore = require('socket.io/lib/stores/redis');
  var   pub    = redis.createClient();
  var   sub    = redis.createClient();
  var   client = redis.createClient();

  io.set('store', new RedisStore({
      redisPub : pub
    , redisSub : sub
    , redisClient : client
  }));


  // setting up a default namespace, for now we can accept all connections
	io.of('/weiqi').authorization(function(handshakeData, successCallback) {
    console.log('socket.io handshake of:"/"' ,handshakeData)

    console.log('parseCookit', parseCookie)
		var cookies = parseCookie(handshakeData.headers.cookie);
    console.log('cookies', cookies)
		sessionStore.get(cookies['connect.sid'], function(err, sessionData) {
			handshakeData.session = sessionData; // || {};
			handshakeData.sid = cookies['connect.sid']|| null;
			successCallback(err, err ? false : true);
		});
	});

	io.on('connection', function(socket) {
    console.log('of \'/\' connection')
		var user = socket.handshake.session.user ? socket.handshake.session.user.name : 'UID: '+(socket.handshake.session.uid || 'has no UID');

		// Join user specific channel, this is so content is sent across user tabs.
		socket.join(socket.handshake.sid);

		socket.send('welcome: '+ user);
    socket.emit('news', { hello: 'world' });

		socket.on('message', function(msg) {
			// Send bsuccessCallback the message to the users room.
			io.sockets.in(socket.handshake.sid).send('socket.io relay message "'+msg+'" from: '+ user +' @ '+new Date().toString().match(/[0-9]+:[0-9]+:[0-9]+/));
		});

		socket.on('disconnect', function() { console.log('disconnect'); });

	});

	io.on('error', function(){ console.log(arguments); });

  // https://github.com/LearnBoost/socket.io/wiki/Authorizing
	io.of('/game').authorization(function(handshakeData, successCallback) {
    console.log('socket.io handshake of:"/"', handshakeData)
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
      console.log("a game connection was made!");

  });






	return io;
};
