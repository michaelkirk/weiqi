
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

  //TODO doing this makes mongo_client local, and not in the scope of the
  //boards controller. Is there a better way to do this? E.g. an explicit export
  //and then accessing it via app.redis_client?

  // express.js < 4
  var mongoStore = require('connect-mongo')(express);
  var mongo_client = require('./lib/persistence/mongo/client.js')


  app.use(express.session({
    store: new mongoStore({
      db: (process.env.DATABASE_NAME || "weiqi")
      // defaults:
      /*  host: '127.0.0.1',
        port: 27017,
        stringify: true,
        collection: 'sessions',
        auto_reconnect: false,
        ssl: false,
        w: 1,
        defaultExpirationTime:  1000 * 60 * 60 * 24 * 14  */
    })
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
  app.use(express.errorHandler({dumpExceptions: true, showStack: true }))
});

// build weiqi routes
var routes = require('./routes')(app);


// set up our socket.io routes
var server = http.createServer(app);
app.io = require('socket.io').listen(server)
app.io.sockets.on('connection', function(socket) {
  socket.on('join board', function(board_id) {
    socket.join(board_id);
  });
});

// bind to a port
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
