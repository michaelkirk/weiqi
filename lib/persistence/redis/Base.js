var Q = require("q");
var redis_client = require('./client.js');
var uuid = require('node-uuid');

module.exports = function(options){

  var util = require('util')

  weiqi.RecordNotFoundError = function (msg, constr) {
    Error.captureStackTrace(this, constr || this)
    this.message = msg || 'Error'
  }
  util.inherits(weiqi.RecordNotFoundError, Error)
  weiqi.RecordNotFoundError.prototype.name = 'RecordNotFound Error'

  var name = options['name'];
  if ( !name ) { throw new Error("name is required"); }

  var model = options['model'];
  if ( !model ) { throw new Error("model is required"); }

  var redis_model = require('../backbone_sync.js')(model)

  redis_model = redis_model.extend({

    pk: function(){
      return name + ':' + this.id;
    },

    create: function(options){
      var deferred = Q.defer();
      var model = this;
      this.id = uuid.v4()
      redis_client.set(this.pk(), JSON.stringify(this.toJSON()), function(err, result) {

        if(err || result == null){
          deferred.reject(err)
        }
        else{
          deferred.resolve(model.toJSON());
        }
      })
      return deferred.promise; 
    },
    update: function(options){
      var deferred = Q.defer();
      var model = this;
      redis_client.set(this.pk(), JSON.stringify(this.toJSON()), function(err, result) {
        if(err || result == null){
          deferred.reject(err)
        }
        else{
          deferred.resolve(model.toJSON());
        }
      })
      return deferred.promise
    },
    delete: function(options){
      throw new Error("not implemented yet")

    },
    read: function(options){
      var deferred = Q.defer();
      var model = this;
      redis_client.get(this.pk(), function(err, result) {
        if(err) {
          deferred.reject(err);
        } else if (result == null) {
          deferred.reject(new weiqi.RecordNotFoundError());
        } else {
          deferred.resolve(JSON.parse(result));
        }
      });

      return deferred.promise

    },
    install_schema: function(){

    }

  })

  return redis_model;

}
