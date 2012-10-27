var _init = function(weiqi){

  weiqi.Board = this.Backbone.Model.extend({
    defaults: {
      width: 19,
      move_count:0,
      last_played: null
    },
    get_cell: function(x,y) {
      if(x < this.get('width') && y < this.get('width')){
        return this.cells[x][y];
      }
      else {
        throw new Error("attempting to accessing outside of game board");
      }
    },
    parse: function(attributes) {
      debugger;
      var cells_attr = attributes['cells'];
      this.set('width', cells_attr.length);
      for(x=0; x < this.get('width'); x++){
        for(y=0; y < this.get('width'); y++){
          this.cells[x][y].set(cells_attr[x][y]);
        }
      }
    },
    play: function(color, x, y) {
      if(this.get("last_played") == color) { throw new weiqi.IllegalMoveError("It's not your turn.") }
      this.get_cell(x,y).play(color);
      this.set("last_played", color);
      this.set("move_count", this.get('move_count') + 1)
      return true;
    },
    play_black: function(x,y) {
      return this.play("black", x, y);
    },
    play_white: function(x,y) {
      return this.play("white", x, y);
    },
    clear: function() {
      _.each(this.cells, function(column) {
        _.each(column, function(cell) {
          cell.set('holds', null);
        });
      });
      this.set('move_count', 0)
      this.set('last_played', null)
    },
    width: function() {
      return this.get('width');
    },
    initialize: function(attributes) {
      this.set('cells', this.blank_board(this.get('width')));

      this.cells = [];
      for(x=0; x < this.get('width'); x++){
        this.cells[x] = [];
        for(y=0; y < this.get('width'); y++){
          this.cells[x][y] = new weiqi.Cell({x: x, y: y, board: this});
        }
      }
      //TODO is this too frequently?
      this.on('change', this.save);
    },
    blank_board: function(width) {
      var cells = [];
      for(x=0; x < width; x++){
        cells[x] = [];
        for(y=0; y < width; y++){
          cells[x][y] = {x: x, y: y, holds: null};
        }
      }
      return cells;
    },
    url: function(){
      return this.urlRoot + '/' + this.id + '.' + 'json';
    },
    urlRoot: '/boards'

  });

  return weiqi
}

if(typeof exports === "undefined"){
  this['weiqi'] = this['weiqi'] || {};
  weiqi = _init(weiqi)
}
else
  module.exports = _init;
