var underscore = require("underscore");
require('../lib/weiqi-models.js')

module.exports = function(app){

  boards = {};

  boards.list = function(req, res){
    res.render('boards/list');
  }

  function notFound(req, res) {
    res.status(404);
    res.render('errors/404');
  }

  boards.show = function(req, res){
    if(req.params.format == 'json') {
      redis_client.get('boards:' + req.params.id, function(err, result) {
        if( result == undefined) { return notFound(req, res); }
        res.set('Content-Type', 'application/json');
        res.send(result.toString());
      });
    } else if (req.params.format == undefined) {
      redis_client.get('boards:' + req.params.id, function(err, result) {
        res.render('boards/show', {
          id: req.params.id,
          board_json: result.toString(),
          player_color: req.params.player_color
        });
      });
    } else {
      return notFound(req, res);
    }
  }

  boards.create = function(req, res){
    redis_client.incr("boards:id", function(err, id) {
      var board = new weiqi.Board({ id: id });
      redis_client.set('boards:'+ board.id,  JSON.stringify(board.attributes), function(err, result) {
        res.redirect(302, '/boards/' + board.id + '/black');
      });
    });
  }

  boards.update = function(req, res){
    var id = req.params.id

    //TODO see if it exists, else 404
    if(req.params.format == 'json') {
      attributes_string = JSON.stringify(req.body);
      redis_client.set('boards:' + id, attributes_string, function(err, result) {
        app.io.sockets.emit('board-update');
        res.status(200);
        res.set('Content-Type', 'application/json');
        res.send(attributes_string);
      });
    } else {
      return notFound(req, res);
    }
  }

  return boards;
}
