describe("Board", function() {
  var board = new Board;
  beforeEach(function() {
    board.clear();
  });

  it("should be 19 cells wide by default", function() {
    expect(board.get('width')).toEqual(19);
  });

  it("should have a (width x width) matrix of cells", function() {
    expect(board.get('cells').length).toEqual(19);
    _.each(board.get('cells'), function(column) {
      expect(column.length).toEqual(19);
    });
  });

  describe("#cells", function() {
    it("should fetch cells", function() {
      mock_cell = 'something';
      board.get('cells')[2][2] = mock_cell;
      expect(board.get_cell(2, 2)).toEqual(mock_cell);
    });
    it("should do boundary checking", function() {
      expect(function() {
        board.get_cell(20, 9)
      }).toThrow();
    });
  });

  describe("#clear", function() {
    it("should clear the board", function() {
      board.play_white(5,2);
      board.clear();
      _.each(board.get('cells'), function(column) {
        _.each(column, function(cell) {
          expect(cell.is_empty()).toEqual(true);
        });
      });
    });
  });

  describe("alternate colors", function() {
    it("should let you alternate", function() {
      expect(board.play_black(4,4)).toEqual(true);
      expect(board.play_white(2,4)).toEqual(true);
    });
    it("shouldn't let you play the same color twice in a row", function() {
      expect(board.play_black(4,4)).toEqual(true);
      expect(function() {
        board.play_black(2,4);
      }).toThrow(new IllegalMoveError("It's not your turn."));
    });

    it("it should let you play a color, clear the board, and play that color again", function() {
      expect(board.play_black(4,4)).toEqual(true);
      board.clear()
      expect(board.play_black(4,4)).toEqual(true);
    });
  });

  describe("counting moves", function() {
    it("move_count should increment with each move", function() {
      board.play_white(2,4)
      board.play_black(4,4)
      expect(board.get('move_count')).toEqual(2)
    });
  });

});
