
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

  var mongoose = require('mongoose'),
    db_url = process.env.MONGOLAB_URI || "mongodb://localhost/weiqi_development";

  db = mongoose.createConnection(db_url);
  db.on('error', console.error.bind(console, 'connection error:'));

  //TODO doing this makes redis_client local, and not in the scope of the
  //boards controller. Is there a better way to do this? E.g. an explicit export
  //and then accessing it via app.redis_client?
  //var redis_client;
  var redisStore = require('connect-redis')(express);
  var redis = require("redis");
  if (process.env.REDISTOGO_URL) {
    var rtg = require("url").parse(process.env.REDISTOGO_URL);
    redis_client = redis.createClient(rtg.port, rtg.hostname);

    redis_client.auth(rtg.auth.split(":")[1]);
  } else {
    redis_client = redis.createClient();
  }

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
});

// build weiqi routes
var routes = require('./routes')(app);


// set up our socket.io routes
var server = http.createServer(app);
var io = require('socket.io').listen(server)

// bind to a port
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
