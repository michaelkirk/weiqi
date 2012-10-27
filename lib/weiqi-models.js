this['underscore'] = underscore = _ = require('underscore');
this['Backbone'] = require('backbone');

var weiqi = {};
weiqi = underscore.extend(weiqi, underscore.bind(require('../public/js/models/Board.js'), this)(weiqi));
weiqi = underscore.extend(weiqi, underscore.bind(require('../public/js/models/Cell.js'), this)(weiqi));

global.weiqi = weiqi

module.exports = weiqi
