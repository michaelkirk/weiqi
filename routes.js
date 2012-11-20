module.exports = function(app) {

  // pass the app into each controller
  var index = require('./controllers/index')(app);
  var user = require('./controllers/users')(app);
  var board = require('./controllers/boards')(app);
  var move = require('./controllers/moves')(app);
  
  app.get('/', board.list);

  // user
  app.all('/users', user.list);
  app.all('/users/:id/:op?', user.load);
  app.get('/users/:id', user.view);
  app.get('/users/:id/view', user.view);
  app.get('/users/:id/edit', user.edit);
  app.put('/users/:id/edit', user.update);

  // move
  app.get('/boards/:board_id/moves/:move_id', move.show);
  app.post('/boards/:board_id/moves', move.create);

  // board
  app.get('/boards', board.list);
  app.post('/boards', board.create);
  app.get('/boards/:id.:format', board.show);
  app.get('/boards/:id/:player_color', board.show);
  app.put('/boards/:id.:format', board.update);
  
  function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
  }

  // Error handling
  // https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x
  /*
  app.use(function(err, req, res, next){
    // Log the error to Airbreak if available, good for backtracking.
    console.log(err);
    //if (airbrake) { airbrake.notify(err); }

    if (err instanceof NotFound) {
      res.render('errors/404', {status: 404});
    } else {
      res.render('errors/500', {error: err, status: 500});
    }
  });*/
}
