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
    initialize: function(attributes) {
      this.on("change:holds", this.update_board);
    },
    // This seems wonky, data is being duplicated, but I'm dealing with:
    // making events propogate from cell-view -> cell -> board
    // keeping board.attributes with only json primitives (no BB models)
    update_board: function() {
      var cells_attr = this.board.get('cells');
      cells_attr[this.get('x')][this.get('y')].holds = this.get('holds');
      this.board.set('cells', cells_attr);
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
  });

  return weiqi;
}


if(typeof exports === "undefined"){
  this['weiqi'] = this['weiqi'] || {};
  weiqi = _init(weiqi)
}
else
  module.exports = _init;
