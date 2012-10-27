var underscore = require("underscore");
require('../lib/weiqi-models.js')

module.exports = function(app){

  boards = {};

  boards.list = function(req, res){
    res.render('boards/list', {
              action: 'list'
    });
  }
  boards.show = function(req, res){
    if(req.params.format == 'json') {
      res.status(205);
      res.render('boards/stub', {
        action: 'show-json'
      });
    } else if (req.params.format == undefined) {
      res.render('boards/stub', {
        action: 'show'
      });
    } else {
      res.status(404);
      res.render('errors/404');
    }
  }
  boards.create = function(req, res){
    debugger
    //var id = redis.increment('boards:next_id');
    var id = 670;
    var board = new weiqi.Board({ id: id });
    redis.set('boards:'+ board.id,  JSON.stringify(board.attributes));

    res.redirect(201, 'boards/show/' + board.id);
  }
  boards.update = function(req, res){
    res.render('boards/stub', {
              action: 'update'
    });
  }


  return boards;
}
