var Player = require('./Player');
var Q = require("q");

module.exports = function(options){
  var BaseBoard = require('./Base')(options)
  
  var Board = BaseBoard.extend({
    create: function() {
      var board = this;
      // wrap the original board promise in another promise
      // the callbacks are chaining in an incorrect order
      var deferred = Q.defer();
      var create_promise = BaseBoard.prototype.create.apply(this, arguments)
      
      create_promise.then(function() {
        return board.create_white_player();
      }).then(function() {
        return board.create_black_player();
      }).then(function(){
        deferred.resolve(board.toJSON())
      })

      return deferred.promise;
    },
    create_player: function(color) {
      var player = new Player({ board_id: this.id, color: color });
      return player.save();
    },
    create_white_player: function() {
      return this.create_player("white");
    },
    create_black_player: function() {
      return this.create_player("black");
    },
    white_player_id: function() {
      return Player.id_for_board_id_and_color(this.id, "white");
    },
    black_player_id: function() {
      return Player.id_for_board_id_and_color(this.id, "black");
    }
  });

  return Board;
}
