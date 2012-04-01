var _init = function(weiqi){

  weiqi.IllegalMoveError = function(message) {
      this.name = "IllegalMoveError";
      this.message = (message || "");
  }
  weiqi.IllegalMoveError.prototype = Error.prototype;

  weiqi.Cell = this.Backbone.Model.extend({
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
