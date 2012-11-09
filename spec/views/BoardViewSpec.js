describe("BoardView", function() {

  describe("#initialize", function() {
    it("should create a cell view for each cell", function() {
      var board = new weiqi.Board();
      var $el = $('<div>');
      var board_view = new weiqi.BoardView({model: board, el: $el});
      expect(board_view.cells.length).toEqual(board.get('width') * board.get('width'));
    });
  });

  describe("#render", function() {
    var board = new weiqi.Board();
    var $el = $('<div>');
    var board_view = new weiqi.BoardView({model: board, el: $el});

    it("should render each of it's cells", function() {
      spyOn(board_view.cells[0], 'render');
      //spot check
      spyOn(board_view.cells[20], 'render');

      board_view.render();

      expect(board_view.cells[0].render).toHaveBeenCalled();
      expect(board_view.cells[20].render).toHaveBeenCalled();
    });
  });

  describe("integration tests", function() {
    var board, $el, board_view, empty_cell;
    beforeEach(function() {
      board = new weiqi.Board();
      $el = $('<div>');
      board_view = new weiqi.BoardView({model: board, el: $el, player_color: "black"});
    });

    describe("gameplay", function() {
      it("should let you play on an empty cell", function() {
        var empty_cell = board.get_cell(0, 1);
        var cell_view = new weiqi.CellView({model: empty_cell, board_view: board_view});
        
        expect(cell_view.model.is_empty()).toBeTruthy();
        cell_view.$el.click();
        expect(cell_view.model.get('holds')).toEqual("black");
      });

      it("should not let you play on a full cell", function() {
        var full_cell = board.get_cell(0, 2);
        full_cell.play("black");
        var cell_view = new weiqi.CellView({model: full_cell, board_view: board_view});

        expect(function(){ cell_view.$el.click() }).toThrow("Can only play in empty cells.");
      });
    });
  });
});
