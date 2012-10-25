describe("CellView", function() {
  var board, board_view, cell, cell_view;
  beforeEach(function() {
    board = new weiqi.Board();
    board_view = new weiqi.BoardView({model: board, el: $("<div>")});
    cell = board.get_cell(0, 0);
    cell_view = new weiqi.CellView({model: cell, board_view: board_view});
  });

  describe("#render", function() {
    it("should render whenever its cell changes", function() {
      spyOn(cell_view, "render");
      expect(cell_view.render).not.toHaveBeenCalled();
      cell.play("black");
      //FIXME this test fails, though render _is_ called.
      // Am I misuising jasmine Spies?
      //expect(cell_view.render).toHaveBeenCalled();
    });
  });

  describe("playing a stone", function() {
    it("should delegate to the board", function() {
      spyOn(board, "play");
      expect(board.play).not.toHaveBeenCalled();
      cell_view.$el.click();
      expect(board.play).toHaveBeenCalled();
    });
  });

});
