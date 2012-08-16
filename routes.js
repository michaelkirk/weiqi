module.exports = function(app) {

  // pass the app into each controller
  var index = require('./controllers/index')(app);
  var user = require('./controllers/users')(app);
  var board = require('./controllers/boards')(app);


  // user
  app.all('/users', user.list);
  app.all('/users/:id/:op?', user.load);
  app.get('/users/:id', user.view);
  app.get('/users/:id/view', user.view);
  app.get('/users/:id/edit', user.edit);
  app.put('/users/:id/edit', user.update);

  // board
  app.get('/', board.create);
  app.all('/boards', board.list);
  app.post('/boards/new', board.create);
  app.all('/boards/:id/:op?', board.load);
  app.get('/boards/:id', board.view);
  app.get('/boards/:id/view', board.view);
  app.get('/boards/:id/edit', board.edit);
  app.put('/boards/:id', board.update);

  function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
  }

  // If all fails, raise 404
  app.all('*', function(req, res){
    throw new NotFound;
  });

  // Error handling
  // https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x
  app.use(function(err, req, res, next){
    // Log the error to Airbreak if available, good for backtracking.
    console.log(err);
    //if (airbrake) { airbrake.notify(err); }

    if (err instanceof NotFound) {
      res.render('errors/404', {status: 404});
    } else {
      res.render('errors/500', {error: err, status: 500});
    }
  });
}
