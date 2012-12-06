var Player = require('./Player');

module.exports = function(options){
  var BaseBoard = require('./Base')(options)
  
  var Board = BaseBoard.extend({
    create: function() {
      var board = this;
      return BaseBoard.prototype.create().then(function() {
        return board.create_white_player();
      }).then(function() {
        return board.create_black_player();
      });
    },
    create_player: function(color) {
      var player = new Player({ board_id: this.id, color: color });
      return player.create();
    },
    create_white_player: function() {
      return this.create_player("white");
    },
    create_black_player: function() {
      return this.create_player("black");
    }
  });

  return Board;
}
