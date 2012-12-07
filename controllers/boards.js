var underscore = require("underscore");
var weiqi = require('../lib/weiqi-models.js')

module.exports = function(app){

  function notFound(req, res) {
    res.status(404);
    res.render('errors/404');
  }

  boards = {};

  boards.list = function(req, res){
    res.render('boards/list');
  }

  boards.show = function(req, res){
    var player, board_id, board;

    player = new weiqi.Player({ id: req.params.id });
    player.fetch().then(function() {
      board_id = player.get('board_id');
      board = new weiqi.Board({ id: board_id });
      console.log('board: ' + board_id);
      return board.fetch();
    }).then(function() {
      if(req.params.format == 'json') {
        res.set('Content-Type', 'application/json');
        res.set('Cache-Control', 'no-cache');
        res.send(board.toJSON());
      } else {
        res.render('boards/show', {
          id: req.params.id,
          board_json: JSON.stringify(board.toJSON()),
          player_color: player.color
        });
      }
    }).fail(function(err){
      console.log(err);
      return notFound(req, res);
    });
  }; // end boards.show

  boards.create = function(req, res){
    var board = new weiqi.Board()
    board.save()
      .then(function(){
        return board.white_player_id();
      }).then(function(white_player_id) {
        res.redirect(302, '/boards/' + white_player_id);
      }).fail(function(err){
        // TODO, we have a message here in `err.message` (I think)
        // We probably need to log this..
        res.send("Error saving board;");
      });
  }

  boards.play = function(req, res) {
    var board = new weiqi.Board({id: req.params.id});
    board.fetch()
      .then(function(){
        return board.play(req.body.color, req.body.x, req.body.y);
      }).then(function(){
        return board.save();
      })
      .then(function(){
        res.on('finish', function(){
          app.io.sockets.in(board.id).emit('board-update');
        });
        if(req.params.format == 'json') {
          attributes_string = JSON.stringify(board.toJSON());
          res.status(200);
          res.set('Content-Type', 'application/json');
          res.send(attributes_string);
        } else {
          return notFound(req, res);
        }
      }).fail(function(err){
          res.status(500);
          res.render('errors/500');
      })
  }

  return boards;
}
