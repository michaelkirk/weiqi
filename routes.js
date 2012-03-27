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
  app.put('/users/:id/edit', user.update);

  // board
  app.all('/boards', board.list);
  app.all('/boards/:id/:op?', board.load);
  app.get('/boards/:id', board.view);
  app.get('/boards/:id/view', board.view);
  app.get('/boards/:id/edit', board.edit);
  app.put('/boards/:id/edit', board.update);


}
