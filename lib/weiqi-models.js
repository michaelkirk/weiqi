global.underscore = global._ = require('underscore');
global.Backbone = require('backbone');

var weiqi = {};

// Board
weiqi = underscore.extend(weiqi, require('../public/js/models/Board.js')(weiqi));
weiqi = underscore.extend(weiqi, require('./persistence/redis/Board.js')(weiqi));

// Cell
weiqi = underscore.extend(weiqi, require('../public/js/models/Cell.js')(weiqi));

// Move
weiqi = underscore.extend(weiqi, require('../public/js/models/Move.js')(weiqi));

global.weiqi = weiqi

exports = weiqi
