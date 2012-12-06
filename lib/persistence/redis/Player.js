var Backbone = require('backbone');
var Q = require("q");

var BasePlayer = require('./Base')({ model: Backbone.Model.extend({}), name: "player" });

var Player = BasePlayer.extend({
  create: function() {
    var player = this;
    return BasePlayer.prototype.create().then(function() {
      var deferred = Q.defer();

      // We need to be able to recover the player id from the board id and player color
      var key = Player.key_for_board_id_and_color(player.get('board_id'), player.get('color'));
      redis_client.set(key, player.id, function(err, result) {
        if(err || result == null){
          deferred.reject(err)
        }
        else{
          deferred.resolve(player.toJSON());
        }
      });
      return deferred.promise
    });
  }
});

Player.key_for_board_id_and_color = function(board_id, color) {
  return "board" + ":" + board_id + ":" + color;
}

Player.player_id_for_board_id_and_color = function(board_id, color) {
  var deferred = Q.defer();
  redis_client.get(this.key_for_board_id_and_color(board_id, color), function(err, result) {
    if(err){
      deferred.reject(err)
    }
    else{
      deferred.resolve(result);
    }
  });
  return deferred.promise
}

Player.player_for_board_id = function(board_id, color) {
  var player_id_promise = this.player_id_for_board_id_and_color(board_id, color);

  player_id_promise.then(function(player_id) {
    return new Player({ id: player_id }).fetch();
  });
}

Player.white_player_for_board_id = function(board_id) {
  return this.player_for_board_id(board_id, "white");
}

Player.black_player_for_board_id = function(board_id) {
  return this.player_for_board_id(board_id, "black");
}

module.exports = Player;
