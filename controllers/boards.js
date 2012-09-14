var underscore = require("underscore");
require('../lib/weiqi-models.js')

module.exports = function(app){

  boards = {};

  boards.list = function(req, res){
    res.render('boards/stub', {
              action: 'list'
    });
  }
  boards.load = function(req, res){
    res.render('boards/stub', {
              action: 'load'
    });
  }
  boards.view = function(req, res){
    res.render('boards/stub', {
              action: 'view'
    });
  }
  boards.create = function(req, res){

    require('repl').start()
    res.render('boards/create', {
              action: 'create'
    });

  }
  boards.edit = function(req, res){
    res.render('boards/stub', {
              action: 'edit'
    });
  }
  boards.update = function(req, res){
    res.render('boards/stub', {
              action: 'update'
    });
  }


  return boards;
}
