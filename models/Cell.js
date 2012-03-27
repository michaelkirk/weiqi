function IllegalMoveError(message) {
    this.name = "IllegalMoveError";
    this.message = (message || "");
}
IllegalMoveError.prototype = Error.prototype;

var Cell = Backbone.Model.extend({
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
      throw new IllegalMoveError("Can only play in empty cells.");
    }
  },
  is_empty: function() {
    return this.get('holds') == null
  },
});
