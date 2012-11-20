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

    remove_dead_groups: function(cell_just_played) {
      var dead_groups = _.select(this.stone_cell_groups(), function(group) { return group.is_dead() } );

      //don't kill just played piece just yet
      var potential_suicide = _.detect(dead_groups, function(group) { return _.include(group.stone_cells, cell_just_played) });
      if (potential_suicide) {
        dead_groups = _.reject(dead_groups, function(group) { return _.include(group.stone_cells, cell_just_played) });
      }

      _.each(
        dead_groups,
        function(dead_group) {
          dead_group.remove_stones();
        }
      );

      // If attacking group is still dead after removing any 
      // dead stones, remove it
      if (potential_suicide && potential_suicide.is_dead()){
        potential_suicide.remove_stones();
      }
    },

    /* return all stones in their connected groups */
    stone_cell_groups: function() {
      var groups = []
      _.each(this.stone_cells(), function(stone_cell) {
        var adjacent_groups = _.select(groups, function(group) {
          return group.is_connected_to(stone_cell);
        });

        //Temporarily remove any groups connected to this stone_cell
        groups = _.reject(groups, function(group) {
          return group.is_connected_to(stone_cell);
        });

        //Combine all adjacent groups with this stone
        var combined_group = _.reduce(adjacent_groups, function(a, b) { return a.merge(b) }, new weiqi.Board.Group([stone_cell]));

        //Add those groups plus the new stone_cell back in as a single group
        groups.push(combined_group)
      });

      return groups;
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
      this.remove_dead_groups(this.get_cell(x,y));
      this.save();
      return true;
    },
    play_black: function(x,y) {
      return this.play("black", x, y);
    },
    play_white: function(x,y) {
      return this.play("white", x, y);
    },
    stone_cells: function() {
      return _.reject(_.flatten(this.cells), function(cell) { return cell.is_empty() });
    },
    clear: function() {
      _.each(this.cells, function(column) {
        _.each(column, function(cell) {
          cell.set('holds', null);
        });
      });
      this.set('cells', this.blank_board(this.get('width')));
      this.set('move_count', 0);
      this.set('last_played', null);
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
    urlRoot: '/boards',

  });

  // Helper class for computing liberties
  weiqi.Board.Group = Backbone.Model.extend({
    constructor: function(stone_cells) {
      this.stone_cells = stone_cells;
    },

    //Any group which has a stone with an empty adjacent cell is alive.
    is_alive: function() {
      return _.detect(this.stone_cells, function(stone_cell) {
        return _.detect(stone_cell.adjacent_cells(), function(adjacent_cell) {
          return adjacent_cell.is_empty();
        }) != null;
      }) != null;
    },

    is_connected_to: function(foreign_stone_cell) {
      return _.detect(this.stone_cells, function(group_stone_cell) {
        // Stones are in the same group if they are the same color and adjacent
        return group_stone_cell.get('holds') == foreign_stone_cell.get('holds')
        && group_stone_cell.is_adjacent_to(foreign_stone_cell)
      }) != null;
    },

    is_dead: function() {
      return !this.is_alive();
    },

    merge: function(other_group) {
      return new weiqi.Board.Group(this.stone_cells.concat(other_group.stone_cells));
    },

    remove_stones: function() {
      _.each(this.stone_cells, function(stone_cell) {
        stone_cell.set({ holds: null });
        var cells_attr = stone_cell.board.get('cells');
        cells_attr[stone_cell.get('x')][stone_cell.get('y')].holds = null;
        stone_cell.board.set({ cells: cells_attr });
      });
    },
  });

  return weiqi
}

if(typeof exports === "undefined"){
  this['weiqi'] = this['weiqi'] || {};
  weiqi = _init(weiqi)
}
else
  module.exports = _init;
