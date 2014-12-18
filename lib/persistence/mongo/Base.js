var Q = require("q");
var mongo_promise = require('./client.js');
var crypto = require('crypto');

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

      // 24 character id string, as opposed to using mongo's builtin ObjectID
      this.set('_id', crypto.randomBytes(12).toString('hex'))

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
      mongo_promise.then(function(db){
        console.log('updating!', model.collection_name)
        var collection = db.collection(model.collection_name);
        // update with replacement (instead of using the $set operator) this
        // will replace the entire document in the datastore with the new
        // version
        collection.update({_id: model.id}, model.toJSON(), function(err, count, result){
          if(err || result == null){
            deferred.reject(err)
          }
          else{
            console.log('updated!', count, result)
            deferred.resolve(model.toJSON());
          }
        })
      })
      return deferred.promise;
    },
    delete: function(options){
      throw new Error("not implemented yet")
    },
    read: function(options){
      var deferred = Q.defer();
      var model = this;
      mongo_promise.then(function(db){
        console.log('begin looking up:', model.collection_name)
        var collection = db.collection(model.collection_name);
        collection.findOne({_id: ObjectId(model.id)}, function(err, result){
          console.log('looking up:', err, result)
          if(err) {
            deferred.reject(err);
          } else if (result == null) {
            // TODO, check if this is really null
            deferred.reject(new weiqi.RecordNotFoundError());
          } else {
            console.log('disovered result for', model.collection_name, result)
            model.set(result);
            deferred.resolve(result);
          }
        })
      })

      return deferred.promise

    },
    install_schema: function(){

    }

  })

  return mongo_model;

}
