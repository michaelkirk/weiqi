
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('yae2ieghiegh7Ahdie4U'));

  //TODO doing this makes redis_client local, and not in the scope of the
  //boards controller. Is there a better way to do this? E.g. an explicit export
  //and then accessing it via app.redis_client?
  //var redis_client;
  //The other problem is that there is "offline" code that needs access to the
  //redis_client without the express app. Here I have broken the client code out
  var redisStore = require('connect-redis')(express);
  var redis_client = require('./lib/persistence/redis/client.js')

  app.use(express.session({
    store: new redisStore({client: redis_client})
  }));
  app.use(app.router);
  // app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

// all views (templates) have access to the following variables
app.locals({
  'assetsCacheHashes': function(req, res) {
    return null; 
  }
  , 'session': function(req, res) {
    return req.session;
  }
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.use('/spec',express.static(path.join(__dirname, 'spec')));
  app.use('/jasmine',express.static(path.join(__dirname, 'lib/jasmine-1.1.0')));
});

// build weiqi routes
var routes = require('./routes')(app);


// set up our socket.io routes
var server = http.createServer(app);
app.io = require('socket.io').listen(server)
app.io.sockets.on('connection', function(socket) {
  console.log('server got socket.io connection');
  socket.emit('boards', { welcome_message: "Hello. I'll be sending you updates whenever boards are updated" });
});

// bind to a port
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
