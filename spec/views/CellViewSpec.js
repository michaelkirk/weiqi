describe("CellView", function() {
  var board = new weiqi.Board;
  var cell = board.get('cells')[0][0];
  var board_view = new weiqi.BoardView({model: board, el: $("<div>")});

  var cell_view = new weiqi.CellView({model: cell});

  it("should render whenever its cell changes", function() {
    spyOn(cell_view, "render");
    expect(cell_view.render).not.toHaveBeenCalled();
    cell.play("black");
    expect(cell_view.render).toHaveBeenCalled();
  });

});
