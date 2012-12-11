var underscore = require("underscore");
var weiqi = require('../lib/weiqi-models.js')

module.exports = function(app){

  function render_not_found(res) {
    console.log("rendered not found");
    res.status(404);
    res.render('errors/404');
  }

  function render_error(error, res) {
    console.log("rendered error: " + error);
    res.status(500);
    res.render('errors/500', { error: error });
  }

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
          res.set('Cache-Control', 'no-cache');
          res.send(board.toJSON());
        } else {
          res.render('boards/show', {
            id: req.params.id,
            board_json: JSON.stringify(board.toJSON()),
            player_color: req.params.player_color
          });
        }
      }).fail(function(error){
        if (error instanceof weiqi.RecordNotFoundError) {
          return render_not_found(res);
        } else {
          return render_error(error, res);
        }
      });
  }// end boards.show

  boards.create = function(req, res){
    var board = new weiqi.Board()
    board.save()
      .then(function(){
        res.redirect(302, '/boards/' + board.id + '/white');
      }).fail(function(error){
        return render_error(error, res);
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
          return render_not_found(res);
        }
      }).fail(function(error){
        return render_error(error, res);
      })
  }

  return boards;
}
