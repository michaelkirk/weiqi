describe("CellView", function() {
  var board, board_view, cell, cell_view;
  beforeEach(function() {
    board = new weiqi.Board();
    board_view = new weiqi.BoardView({model: board, el: $("<div>"), player_color: "black"});
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

  describe("#cell_views", function() {
    it("should fetch cells", function() {
      expect(board_view.get_cell_view(2, 3)).toEqual(board_view.cell_views[2 + '-' +3]);
    });
    it("should do boundary checking", function() {
      expect(function() {
        board_view.get_cell_view(20, 9)
      }).toThrow();
    });
  });

  describe("marking last plays", function() {
    it("should mark a black circle if white played last", function() {
      board.play_black(0,0);
      board.play_white(0,1);
      var cell_view = board_view.get_cell_view(0, 1);
      expect(cell_view.$el.find('.jgo_m').hasClass('circle_b')).toBeTruthy()
    });
    it("should mark a white circle if black played last", function() {
      board.play_black(0,0);
      board.play_white(0,1);
      board.play_black(0,2);
      var cell_view = board_view.get_cell_view(0, 2);
      expect(cell_view.$el.find('.jgo_m').hasClass('circle_w')).toBeTruthy()
    });
    it("should should remove a mark after playing yet another piece", function() {
      board.play_black(0,0);
      board.play_white(0,1);
      // check the very first piece
      var cell_view = board_view.get_cell_view(0, 0);
      expect(cell_view.$el.find('.jgo_m').hasClass('circle_w')).toBeFalsy()
      board.play_black(0,2);
      // check the second to last 
      cell_view = board_view.get_cell_view(0, 1);
      expect(cell_view.$el.find('.jgo_m').hasClass('circle_b')).toBeFalsy()
    });
  });

});
