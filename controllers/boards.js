var underscore = require("underscore");
require('../lib/weiqi-models.js')

module.exports = function(app){

  boards = {};

  boards.list = function(req, res){
    res.render('boards/list');
  }

  boards.show = function(req, res){

    var board = new weiqi.Board({id: req.params.id})
    board.fetch()
      .then(function(){
        if(req.params.format == 'json') {
          res.set('Content-Type', 'application/json');
          res.send(board.toJSON());
        } else {
          res.render('boards/show', {
            id: req.params.id,
            board_json: JSON.stringify(board.toJSON())
          });
        }
      })
    .fail(function(){
      res.status(404);
      res.render('errors/404');
    });

  }// end boards.show

  boards.create = function(req, res){
    var board = new weiqi.Board()
    board.save()
      .then(function(){
        res.redirect(302, '/boards/' + board.id);
      })
      .fail(function(err){
        res.send("Error");
      });
  }

  boards.update = function(req, res){
    var board = new weiqi.Board({id: req.params.id});
    board.fetch()
      .then(function(){
        board.set(req.body)
        return board.save()
      })
      .then(function(){
        app.io.sockets.emit('board-update');
        if(req.params.format == 'json') {
          attributes_string = JSON.stringify(board.toJSON());
          res.status(200);
          res.set('Content-Type', 'application/json');
          res.send(attributes_string);
        } else {
          res.status(404);
          res.render('errors/404');
        }
      }).fail(function(err){
          res.status(500);
          res.render('errors/500');
      })
  }

  return boards;
}
