describe("BoardView", function() {

  describe("#initialize", function() {
    it("should keep create a cell view for each cell", function() {

      //This isn't working. Is it possible that backbone models
      //aren't compatible with andCallThrough?
      spyOn(weiqi, 'CellView').andCallThrough();

      var board = new weiqi.Board;
      var $el = $('<div>');
      var board_view = new weiqi.BoardView({model: board, el: $el});

      expect(weiqi.CellView).toHaveBeenCalledWith(board.cells[0][0], board_view);
      expect(weiqi.CellView).toHaveBeenCalledWith(board.cells[8][8], board_view);
      expect(weiqi.CellView).callCount.toEqual(board_view.width() * board_view.width());
    });
  });

  describe("#render", function() {
    var board = new weiqi.Board;
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
});
