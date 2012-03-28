(function(){

  if(typeof exports === "undefined")
    this['weiqi'] = this['weiqi'] || {};
  else
    this['weiqi'] = exports;

  weiqi.IllegalMoveError = function(message) {
      this.name = "IllegalMoveError";
      this.message = (message || "");
  }
  weiqi.IllegalMoveError.prototype = Error.prototype;

  weiqi.Cell = Backbone.Model.extend({
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
        this.set('holds', piece)
        return true;
      }
      else {
        throw new weiqi.IllegalMoveError("Can only play in empty cells.");
      }
    },
    is_empty: function() {
      return this.get('holds') == null
    },
  });
})();
