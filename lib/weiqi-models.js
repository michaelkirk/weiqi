this['underscore'] = underscore = _ = require('underscore');
this['Backbone'] = require('backbone');

var weiqi = {};
//weiqi = underscore.extend(weiqi, underscore.bind(require('../public/js/models/Board.js'), this)(weiqi));
function empty_board_cells(width) {
  var cells = [];
  for(x=0; x < width; x++){
    cells[x] = [];
    for(y=0; y < width; y++){
      cells[x][y] = { "x": x, "y": y, holds: null};
    }
  }
  return cells;
}

db.once('open', function () {
  var mongoose = require('mongoose');

  var BoardSchema = mongoose.Schema({
    cells: {"type": mongoose.Schema.Types.Mixed, default: empty_board_cells(19)}
  }); 

  weiqi.Board = db.model('Board', BoardSchema);
});


weiqi = underscore.extend(weiqi, underscore.bind(require('../public/js/models/Cell.js'), this)(weiqi));

global.weiqi = weiqi

exports = weiqi
