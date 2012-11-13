var _init = function(weiqi){


  weiqi.IllegalMoveError = function(message) {
      this.name = "IllegalMoveError";
      this.message = (message || "");
  }
  weiqi.IllegalMoveError.prototype = Error.prototype;

  weiqi.Cell = Backbone.Model.extend({
    constructor: function(attributes, options) {
      //board isn't a backbone attribute of the cell 
      //(this avoids issues while serializing)
      this.board = attributes.board;
      delete attributes.board;

      Backbone.Model.apply(this, arguments);
    },
    defaults: {
      holds: null,
      x: null,
      y: null
    },
    play: function(piece) {
      if(piece != 'black' && piece != 'white') {
        throw new Error("must play black or white");
      }

      if(this.is_empty()) {
        this.set('holds', piece);
        return true;
      }
      else {
        throw new weiqi.IllegalMoveError("Can only play in empty cells.");
      }
    },
    is_empty: function() {
      return this.get('holds') == null;
    },

    adjacent_cells: function() {
      var adjacent = [];

      if( this.get('x') > 0)
        adjacent.push(this.board.cells[this.get('x') - 1][this.get('y')])
      if( this.get('y') > 0)
        adjacent.push(this.board.cells[this.get('x')][this.get('y') - 1])
      if( this.get('x') < (this.board.get('width') - 1))
        adjacent.push(this.board.cells[this.get('x') + 1][this.get('y')])
      if( this.get('y') < (this.board.get('width') - 1))
        adjacent.push(this.board.cells[this.get('x')][this.get('y') + 1])

      return adjacent;
    },

    is_adjacent_to: function(other_cell) {
      if (this.get('x') == other_cell.get('x')) {
        if (Math.abs(this.get('y') - other_cell.get('y')) == 1) {
          return true;
        }
      } else if (this.get('y') == other_cell.get('y')) {
        if (Math.abs(this.get('x') - other_cell.get('x')) == 1) {
          return true;
        }
      }

      return false;
    }
  });

  return weiqi;
}


if(typeof exports === "undefined"){
  this['weiqi'] = this['weiqi'] || {};
  weiqi = _init(weiqi)
}
else
  module.exports = _init;
