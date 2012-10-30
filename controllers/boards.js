var underscore = require("underscore");
require('../lib/weiqi-models.js')

module.exports = function(app){

  boards = {};

  boards.list = function(req, res){
    weiqi.Board.find(function(err, boards) {
      res.render('boards/list',
                 { 'boards': boards });
    });
  };

  boards.show = function(req, res){
    if(req.params.format == 'json') {
      weiqi.Board.findById(req.params.id, function(err, result) {
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
      });
    } else if (req.params.format == undefined) {
      res.render('boards/show', {
        id: req.params.id
      });
    } else {
      res.status(404);
      res.render('errors/404');
    }
  }

  boards.create = function(req, res){
    var board = new weiqi.Board();
    board.save(function(err) {
      if (err){
        throw err
      } else {
        res.redirect(302, '/boards/' + board.id);
      }
    });
  }

  boards.update = function(req, res){
    //TODO see if it exists, else 404
    
    if (req.params.format == 'json') {
      attributes_string = JSON.stringify(req.body);
      weiqi.Board.update({_id: req.params.id}, req.body, function(err, number_affected, raw_response) {
        res.status(200);
        res.set('Content-Type', 'application/json');
        res.send(attributes_string);
      });
    } else {
      res.status(404);
      res.render('errors/404');
    }
  }

  return boards;
}
