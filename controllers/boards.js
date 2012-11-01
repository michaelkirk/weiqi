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
    var board = new weiqi.Board({id: req.params.id})
    board.fetch().then(
    // success  
    function(){
      if(req.params.format == 'json') {
        redis_client.get('boards:' + req.params.id, function(err, result) {
          res.set('Content-Type', 'application/json');
          res.send(board.toJSON());
        });
      } else {
        redis_client.get('boards:' + req.params.id, function(err, result) {
          res.render('boards/show', {
            id: req.params.id,
            board_json: JSON.stringify(board.toJSON()),
            player_color: req.params.player_color
          });
        });
      }
    },
    // Failure
    function(){
      return notFound(req, res);
    });
  }// end boards.show

  boards.create = function(req, res){
    var board = new weiqi.Board()
    promise = board.save()
    promise.then(function(){
      res.redirect(302, '/boards/' + board.id + '/black');
    },
    function(err){
      console.log("ERROR?", arguments)

      res.send("aaaaaaaaaaaaaaaaaaaaaaa"+arguments);

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
