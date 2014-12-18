var Q = require("q");
var mongo_promise = require('./client.js');
var uuid = require('node-uuid');

module.exports = function(options){

  var name = options['name'];
  if ( !name ) { throw new Error("name is required"); }

  var model = options['model'];
  if ( !model ) { throw new Error("model is required"); }

  var mongo_model = require('../backbone_sync.js')(model)

  mongo_model = mongo_model.extend({

    pk: function(){
      return this.get('_id');
    },

    idAttribute: "_id",

    create: function(attributes, options){

      if(!this.collection_name){
        throw new Error("need the collection_name attribute on the model!")
      }

      var deferred = Q.defer();
      var model = this;

      mongo_promise.then(function(db){
        var collection = db.collection(model.collection_name);
        collection.insert(model.toJSON(), function(err, result){
          result = result[0];
          if(err || result == null){
            console.log('error in create,', err);
            deferred.reject(err)
          }
          else{
            model.set({_id: result._id})
            console.log('set _id to', model.id, result);
            deferred.resolve(result);
          }
        })
      })
      return deferred.promise;
    },
    update: function(options){
      var deferred = Q.defer();
      var model = this;
      mongo_promise.set(this.pk(), JSON.stringify(this.toJSON()), function(err, result) {
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
      mongo_promise.get(this.pk(), function(err, result) {
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

  return mongo_model;

}
