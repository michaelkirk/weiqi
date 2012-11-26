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
        //see if the board throws an error
        var move_promise = board.play(req.body.color, req.body.x, req.body.y)
        move_promise.then(function(){
          res.set('Content-Type', 'application/json');
          res.send(board.moves.last().toJSON());
          // TODO, this becomes a move, 
          // and just push the move json down the socket.
          // At this point we know the move is valid, save the board!
          board.save().then(function(){
            app.io.sockets.emit('board-update', board.moves.last().toJSON());
          })
        }).fail(function(err){
          res.status(500);
          res.send('move failed', err);
        })
      })
    .fail(function(err){
       res.status(500);
       res.send('move failed', err);
    });
  }

  return moves;
}
