describe("CellView", function() {
  var board = new weiqi.Board;
  var cell = board.get('cells')[0][0];
  var board_view = new weiqi.BoardView({model: board, el: $("<div>")});
  var cell_view = new weiqi.CellView({model: cell});

  describe("#render", function() {
    it("should render whenever its cell changes", function() {
      spyOn(cell_view, "render");
      expect(cell_view.render).not.toHaveBeenCalled();
      cell.play("black");
      expect(cell_view.render).toHaveBeenCalled();
    });
  });

  describe("playing a stone", function() {
    it("should let you play on an empty cell", function() {
      empty_cell = board.get('cells')[0][1];
      cell_view = new weiqi.CellView({model: empty_cell});

      expect(cell_view.model.get('holds')).toEqual(null);
      cell_view.$el.click();
      expect(cell_view.model.get('holds')).toEqual("black");
    });

    it("should not let you play on an empty cell", function() {
      cell = board.get('cells')[0][2];
      cell.play("black");
      cell_view = new weiqi.CellView({model: empty_cell});

      expect(cell_view.model.get('holds')).toEqual("black");
      expect(function(){ cell_view.$el.click() }).toThrow("Can only play in empty cells.");
    });
  });

});
