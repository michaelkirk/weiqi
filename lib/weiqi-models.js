global.underscore = global._ = require('underscore');
global.Backbone = require('backbone');
var Q = require("q");

var weiqi = {};

// Board
weiqi = underscore.extend(weiqi, require('../public/js/models/Board.js')(weiqi));
weiqi = underscore.extend(weiqi, require('./persistence/redis/Board.js')(weiqi));

// Cell
weiqi = underscore.extend(weiqi, require('../public/js/models/Cell.js')(weiqi));

// Move
weiqi = underscore.extend(weiqi, require('../public/js/models/Move.js')(weiqi));

// the Move save is a non-op on the server
weiqi.Move = weiqi.Move.extend({ save:function(){ 
  var deferred = Q.defer();
  deferred.resolve();
  return deferred.promise;
}});

global.weiqi = weiqi

exports = weiqi
