function UnknownSyncMethod(message) {
  this.name = "NotImplementedError";
  this.message = (message || "");
}
UnknownSyncMethod.prototype = Error.prototype;

module.exports = function(model){

  return model.extend({

    sync: function(method, model, options){

        // Default options, unless specified.
        options || (options = {});

        if(!options.data && model && (method == 'create' || method == 'update')){
          options.data = JSON.stringify(model.toJSON());
        }

        var promise;
        if(method==="create")  
          promise = model.create(options);
        else if(method==="update")
          promise = model.update(options);
        else if(method==="delete")
          promise = model.delete(options);
        else if(method==="read")
          promise = model.read(options);
        else
          throw new UnknownSyncMethod('unknown method!:'+method)

        // make sure we honor callbacks from fetch, save etc..
        var success = options.success || function(){};
        var error = options.error || function(){};

        promise.then(success, error);

        return promise;
      },

  })
}

