var underscore = require("underscore");
require('../lib/weiqi-models.js')

module.exports = function(app){

  function notFound(req, res) {
    res.status(404);
    res.render('errors/404');
  }

  moves = {};

  moves.show = function(req, res){
    var move = new weiqi.Move({id: req.params.id});
    move.fetch()
      .then(function(){
          res.set('Content-Type', 'application/json');
          res.send(move.toJSON());
      })
    .fail(function(){
      return notFound(req, res);
    });
  }// end moves.show

  moves.create = function(req, res){
    var board = new weiqi.Board({id: req.params.board_id})
    board.fetch()
      .then(function(){
        var move = new weiqi.Move(req.body);
        move.save().then(function(){
          res.set('Content-Type', 'application/json');
          res.send(move.toJSON());
        })
        // TODO move save fails
      })
    .fail(function(err){
      return notFound(req, res);
    });
  }

  return moves;
}
