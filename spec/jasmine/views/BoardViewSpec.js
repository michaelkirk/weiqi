describe("BoardView", function() {

  describe("#initialize", function() {
    it("should create a cell view for each cell", function() {
      var board = new weiqi.Board();
      var $el = $('<div>');
      var board_view = new weiqi.BoardView({model: board, el: $el});
      expect(board_view.cell_views.length).toEqual(board.get('width') * board.get('width'));
    });
  });

  describe("#whose_turn", function() {
    var board;
    beforeEach(function(){
      board = new weiqi.Board();
    });

    describe("when no one has gone yet", function() {
      it("should be black", function() {
        expect(board.whose_turn()).toBe("black");
      });
    });
    describe("when white has just gone", function() {
      it("should be black", function() {
        board.play_black(0,0);
        board.play_white(0,1);
        expect(board.whose_turn()).toBe("black");
      });
    });
    describe("when black has just gone", function() {
      it("should be white", function() {
        board.play_black(0,0);
        expect(board.whose_turn()).toBe("white");
      });
    });
  })

  describe("#render", function() {
    var board = new weiqi.Board();
    var $el = $('<div>');
    var board_view = new weiqi.BoardView({ model: board, el: $el });

    it("should render each of it's cells", function() {
      spyOn(board_view.cell_views[0], 'render');
      //spot check
      spyOn(board_view.cell_views[20], 'render');

      board_view.render();

      expect(board_view.cell_views[0].render).toHaveBeenCalled();
      expect(board_view.cell_views[20].render).toHaveBeenCalled();
    });

    describe("when it's the white player's board", function() {
      var board_view = new weiqi.BoardView({ model: board, el: $el, player_color: "white" });
      it("should render a link to invite an opponent", function() {
        expect(
          $('.share .black a', board_view.render()).length
        ).toEqual(1);
      });
    })
    describe("when it's the black player's board", function() {
    var board_view = new weiqi.BoardView({ model: board, el: $el, player_color: "black" });
      it("should not render a link to invite an opponent", function() {
        expect(
          $('.share a', board_view.render()).length
        ).toEqual(0);
      });
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
