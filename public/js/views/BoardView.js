var BoardView = Backbone.View.extend({
  tagName: "div",
  initialize: function(board, $el) {
    this.board = board;
    this.cells = [];
    var board_view = this;
    _.each(this.board.get('cells'), function(rows) {
      _.each(rows, function(cell) {
        board_view.cells.push(new CellView(cell, board_view));
      });
    });

    this.$el = $el;
    this.$el.addClass('jgo_board');
    this.render();
  },
  render: function(){
    console.log("rendering board")
    _.each(this.cells, function(cell_view) {
      cell_view.render();
    });
  }
});

var CellView = Backbone.View.extend({
  tagName: "div",
  initialize: function(cell, board_view) {
    this.board_view = board_view;
    this.cell = cell;
    x_offset = 30;
    y_offset = 35;

    this.x = cell.get("x") * 31 + x_offset;
    this.y = cell.get("y") * 32.75 + y_offset;

    this.$el.addClass('jgo_c');
    this.$el.attr('style', 'top: ' + this.y + 'px; left: ' + this.x + 'px;"')
  },
  render: function() {
    if(this.cell.get('holds') == 'black') {
      this.$el.removeClass('jgo_w');
      this.$el.addClass('jgo_b');
    }
    else if(this.cell.get('holds') == 'white') {
      this.$el.removeClass('jgo_b');
      this.$el.addClass('jgo_w');
    }
    else if (this.cell.get('holds') == null) {
      this.$el.removeClass('jgo_w');
      this.$el.removeClass('jgo_b');
    }
    this.board_view.$el.append(
      this.$el
    );
  }
})
