var Q = require("q");


var MongoClient = require('mongodb').MongoClient;

// Connect to the db
var deferred = Q.defer();
MongoClient.connect("mongodb://localhost:27017/weiqi", function(err, db) {
  if(err) {
    deferred.reject(err);
  } else{
    deferred.resolve(db);
  }
});

deferred.promise.fail(function(err){
  console.log('failed to connect to database', err);
})

module.exports = deferred.promise;;

