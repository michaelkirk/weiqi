function UnknownSyncMethod(message) {
  this.name = "NotImplementedError";
  this.message = (message || "");
}
UnknownSyncMethod.prototype = Error.prototype;

function NotImplementedError(message) {
  this.name = "NotImplementedError";
  this.message = (message || "");
}
NotImplementedError.prototype = Error.prototype;

module.exports = function(model){

  return model.extend({

    sync: function(method, model, options){

        // Default options, unless specified.
        options || (options = {});

        if(!options.data && model && (method == 'create' || method == 'update')){
          options.data = JSON.stringify(model.toJSON());
        }

        if(method==="create")  
          promise = model.create(options);
        else if(method==="update")
          promise = model.update(options);
        else if(method==="delete")
          promise = model.delete(options);
        else if(method==="read")
          promise = model.read(options);
        else
          throw new Error('unknown method!:'+method)

        // make sure we honor callbacks from fetch, save etc..
        var success = options.success || function(){};
        var error = options.success || function(){};
        return promise.then(success, error)

      },

      install_schema: function(){
        throw NotImplementedError
      }


  })
}

