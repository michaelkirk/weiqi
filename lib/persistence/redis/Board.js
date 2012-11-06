var Q = require("q");
var redis_client = require('./client.js');
var uuid = require('node-uuid');

module.exports = function(weiqi){

  weiqi.Board = require('../backbone_sync.js')(weiqi.Board)

  weiqi.Board = weiqi.Board.extend({

    create: function(options){
      var board = this;
      var deferred = Q.defer();
      this.id = uuid.v4()
      redis_client.set('boards:' + this.id, JSON.stringify(this.toJSON()), function(err, result) {

        if(err || result == null){
          deferred.reject(err)
        }
        else{
          deferred.resolve(board.toJSON());
        }
      
      })
      return deferred.promise; 
    },
    update: function(options){
      deferred = Q.defer();
      var board = this
      redis_client.set('boards:' + this.id, JSON.stringify(this.toJSON()), function(err, result) {
        if(err || result == null){
          deferred.reject(err)
        }
        else{
          deferred.resolve(board.toJSON());
        }
      })
      return deferred.promise
    },
    delete: function(options){
      throw new Error("not implemented yet")

    },
    read: function(options){
      deferred = Q.defer();
      var board = this
      redis_client.get('boards:' + this.id, function(err, result) {

        if(err || result == null){
          deferred.reject(err)
        }
        else{
          deferred.resolve(JSON.parse(result));
        }
      })

      return deferred.promise

    },
    install_schema: function(){

    }

  })

return weiqi;

}
