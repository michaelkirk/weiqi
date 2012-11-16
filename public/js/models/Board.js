var _init = function(weiqi){

  weiqi.Board = Backbone.Model.extend({
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
    update_cells: function(cells_attributes) {
      for(x=0; x < this.get('width'); x++){
        for(y=0; y < this.get('width'); y++){
          this.cells[x][y].set(cells_attributes[x][y]);
        }
      }
    },
    parse: function(attributes) {
      this.update_cells(attributes['cells']);
      return attributes;
    },
    whose_turn: function() {
      //black goes first
      if (this.get("last_played") == undefined || this.get("last_played") == "white") { 
        return "black";
      } else {
        return "white";
      }
    },
    play: function(color, x, y) {
      if (this.whose_turn() != color) { throw new weiqi.IllegalMoveError("It's not your turn.") }

      if (this.get_cell(x, y).play(color)) {
        var cells_attr = this.get('cells');
        cells_attr[x][y].holds = color;
        this.set({ 
          cells: cells_attr,
          last_played: color,
          move_count: this.get('move_count') + 1
        });
      }
      this.save();
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
      if( this.get('cells') == undefined ) {
        this.set({cells: this.blank_board(this.get('width'))},
                 {silent: true});
      }
      
      //Instantiate cell models from boards cell attributes
      this.cells = [];
      for(x=0; x < this.get('width'); x++){
        this.cells[x] = [];
        for(y=0; y < this.get('width'); y++){
          this.cells[x][y] = new weiqi.Cell(_.extend({board: this}, this.get('cells')[x][y]));
        }
      }

      //TODO this only makes sense on client side, 
      // is there a better way to do it?
      if(typeof exports === "undefined"){
        this.socket = site.socketClient;
        var board = this;
        this.socket.on('board-update', function (data) {
          console.log('boards-updated, refreshing local board');
          board.fetch();
        });
      }
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
    black_player_url: function() {
      return this.urlRoot + '/' + this.id + '/' + 'black';
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
