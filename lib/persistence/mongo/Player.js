var Backbone = require('backbone');
var Q = require("q");
var mongo_promise = require('./client.js');

module.exports = function(weiqi){

var BasePlayer = require('./Base')({model: Backbone.Model, name: 'player'});

weiqi.Player = BasePlayer.extend({

  collection_name: "players",
});

// class methods
weiqi.Player.find_by_board_id_and_color = function(board_id, color) {

  var deferred = Q.defer();

  var model = this;

  mongo_promise.then(function(db) {
    var collection = db.collection('players');
    collection.findOne({board_id: board_id, color: color}, function(err, result){
      if(err){
        deferred.reject(err);
      }
      else{
        deferred.resolve(new weiqi.Player(result));
      }
    })
  }).fail(function(err){
    console.log('IN FAIL', err);
    deferred.reject(err)
  })
  return deferred.promise;
};

// set up index 
mongo_promise.then(function(db) {
  var collection = db.collection('players');
  collection.ensureIndex({board_id:1, color: 1}, {unique:true}, function(err, indexName) {
    if(err){
      console.log('Error setting up unique index on players', err);
    }
  })
  return mongo_promise;
});


return weiqi

}
