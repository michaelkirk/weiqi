var Backbone = require('backbone');
var Q = require("q");

module.exports = function(weiqi){

var BasePlayer = require('./Base')(Backbone.Model);

weiqi.Player = BasePlayer.extend({

  pk: function(){
    return 'board' + ':' + this.id;
  },

  create: function() {
    var player = this;
    return BasePlayer.prototype.create.apply(this, arguments).then(function() {
      var deferred = Q.defer();

      // We need to be able to recover the player id from the board id and player color
      var key = weiqi.Player.key_for_board_id_and_color(player.get('board_id'), player.get('color'));
      console.log('recordin player id: ' + player.id)
      console.log('with key: ' + key)
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
  },
});

weiqi.Player.key_for_board_id_and_color = function(board_id, color) {
  return "board" + ":" + board_id + ":" + color;
}

weiqi.Player.id_for_board_id_and_color = function(board_id, color) {
  var deferred = Q.defer();
  var key = this.key_for_board_id_and_color(board_id, color);
  redis_client.get(key, function(err, result) {
    if(err){
      deferred.reject(err)
    }
    else{
      console.log("got player id: "+ result);
      console.log('with key: ' + key);
      deferred.resolve(result);
    }
  });
  return deferred.promise
}

weiqi.Player.find_by_board_id_and_color = function(board_id, color) {
  var player_id_promise = this.id_for_board_id_and_color(board_id, color);

  return player_id_promise.then(function(player_id) {
    return new weiqi.Player({ id: player_id });
  });
}

return weiqi

}
