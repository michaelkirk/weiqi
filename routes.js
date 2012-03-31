var index = require('./controllers/index');
var user = require('./controllers/users');
var board = require('./controllers/boards');

module.exports = function(app) {


  // some main pages
  app.all('/', index.index);

  // user
  app.all('/users', user.list);
  app.all('/users/:id/:op?', user.load);
  app.get('/users/:id', user.view);
  app.get('/users/:id/view', user.view);
  app.get('/users/:id/edit', user.edit);
  // should be put, but raw html forms in e.g. firefox 
  // do not support "PUT" as method
  app.post('/users/:id/edit', user.update);

  // board
  app.all('/boards', board.list);
  app.all('/boards/:id/:op?', board.load);
  app.get('/boards/:id', board.view);
  app.get('/boards/:id/view', board.view);
  app.get('/boards/:id/edit', board.edit);
  app.put('/boards/:id/edit', board.update);

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
  app.error(function(err, req, res, next){
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
