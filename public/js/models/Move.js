var _init = function(weiqi){
  weiqi.Move = Backbone.Model.extend({
    defaults: {
      x: null,
      y: null,
      color: null,
    }
  });

  weiqi.MoveCollection = Backbone.Collection.extend({
    model: weiqi.Move,
    initialize: function(moves, options){
      this.board = options.board;
      this.on('add', this.sync_to_board, this);
    },
    comparator: function(move) { return move.get('num') },
    sync_to_board: function(){
      // keep the board state up to date with each move
      this.board.set('moves', this.toJSON());
    },
    is_same_as_last_move: function(move){
      var last_move = _(this.models.reverse()).detect(function(last_move) { return last_move.get('color') == move.get('color') });
      if (last_move
          && last_move.get('x') == move.get('x') 
          && last_move.get('y') == move.get('y')) { 
        return true 
      } else {
        return false
      }
    }
  });

  return weiqi
}

if(typeof exports === "undefined"){
  this['weiqi'] = this['weiqi'] || {};
  weiqi = _init(weiqi)
}
else
  module.exports = _init;
