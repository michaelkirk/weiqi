// Fetch the site configuration
var siteConf = require('./lib/getConfig');
process.title = siteConf.uri.replace(/http:\/\/(www)?/, '');

var airbrake;
if (siteConf.airbrakeApiKey) {
  airbrake = require('airbrake').createClient(siteConf.airbrakeApiKey);
}

process.addListener('uncaughtException', function (err, stack) {
  console.log('Caught exception: '+err+'\n'+err.stack);
  console.log('\u0007'); // Terminal bell
  if (airbrake) { airbrake.notify(err); }
});

var connect = require('connect');
var express = require('express');
var assetManager = require('connect-assetmanager');
var assetHandler = require('connect-assetmanager-handlers');
//var notifoMiddleware = require('connect-notifo');
var DummyHelper = require('./lib/dummy-helper');

// Heroku backwards compatible session store
var HerokuRedisStore = require('connect-heroku-redis')(express);
var sessionStore = new HerokuRedisStore;

var app = module.exports = express.createServer();

// Set up the app database connection
var redis = require('redis')
app.db = redis.createClient()

app.listen(siteConf.port, null);

// Setup socket.io server
var socketIo = new require('./lib/socket-io-server.js')(app, sessionStore);
var authentication = new require('./lib/authentication.js')(app, siteConf);
// Setup groups for CSS / JS assets
var assetsSettings = {

  'js': {
    'route': /\/static\/js\/[a-z0-9]+\/.*\.js/
    , 'path': './public/js/'
    , 'dataType': 'javascript'
    , 'files': [
      'http://code.jquery.com/jquery-latest.js'
      , siteConf.uri+'/socket.io/socket.io.js' // special case since the socket.io module serves its own js
      , 'vendor/underscore.js'
      , 'vendor/backbone.js'
      , 'weiqi.js'
      , 'models/Board.js'
      , 'models/Cell.js'
      , 'views/BoardView.js'
    ]
    , 'debug': true
    , 'postManipulate': {
      '^': [
        //assetHandler.uglifyJsOptimize,
         function insertSocketIoPort(file, path, index, isLast, callback) {
          callback(file.replace(/.#socketIoPort#./, siteConf.port));
        }
      ]
    }
  }
  , 'css': {
    'route': /\/static\/css\/[a-z0-9]+\/.*\.css/
    , 'path': './public/css/'
    , 'dataType': 'css'
    , 'files': [
      'reset.css'
      , 'client.css'
    ]
    , 'debug': true
    , 'postManipulate': {
      '^': [
        assetHandler.fixVendorPrefixes
        , assetHandler.fixGradients
        , assetHandler.replaceImageRefToBase64(__dirname+'/public')
        , assetHandler.yuiCssOptimize
      ]
    }
  }
};
// Add auto reload for CSS/JS/templates when in development
app.configure('development', function(){
//  assetsSettings.js.files.push('jquery.frontend-development.js');
//  assetsSettings.css.files.push('frontend-development.css');
  [['js', 'updatedContent'], ['css', 'updatedCss']].forEach(function(group) {
    assetsSettings[group[0]].postManipulate['^'].push(function triggerUpdate(file, path, index, isLast, callback) {
      callback(file);
      dummyHelpers[group[1]]();
    });
  });
});

var assetsMiddleware = assetManager(assetsSettings);

// Settings
app.configure(function() {
  app.set('view engine', 'jade');
  // enable template inheritance by turning off layout
  app.set('view options', { layout: false });
  app.set('views', __dirname+'/views');
});

// Middleware
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(assetsMiddleware);
  app.use(express.session({
    'store': sessionStore
    , 'secret': siteConf.sessionSecret
  }));
  app.use(express.logger({format: ':response-time ms - :date - :req[x-real-ip] - :method :url :user-agent / :referrer'}));
  app.use(authentication.middleware.auth());
  app.use(authentication.middleware.normalizeUserData());
  app.use(express['static'](__dirname+'/public', {maxAge: 86400000}));
});

// ENV based configuration

// Show all errors and keep search engines out using robots.txt
app.configure('development', function(){
  app.use(express.errorHandler({
    'dumpExceptions': true
    , 'showStack': true
  }));
  app.all('/robots.txt', function(req,res) {
    res.send('User-agent: *\nDisallow: /', {'Content-Type': 'text/plain'});
  });
});
// Suppress errors, allow all search engines
app.configure('production', function(){
  app.use(express.errorHandler());
  app.all('/robots.txt', function(req,res) {
    res.send('User-agent: *', {'Content-Type': 'text/plain'});
  });
});

// all views (templates) have access to the following variables
app.locals({
  'assetsCacheHashes': function(req, res) {
    return assetsMiddleware.cacheHashes;
  }
  , 'session': function(req, res) {
    return req.session;
  }
});

// build a set of application routes
routes = require('./routes')(app)

// Initiate this after all other routing is done, otherwise wildcard will go crazy.
// :(
var dummyHelpers = new DummyHelper(app);

console.log('Running in '+(process.env.NODE_ENV || 'development')+' mode @ '+siteConf.uri);
