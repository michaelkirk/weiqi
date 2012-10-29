if(!(typeof exports == "undefined")){
  require('../../lib/weiqi-models.js');
  require('jasmine-node');
}

describe("Board", function() {
  var board = new weiqi.Board();
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
      expect(board.get_cell(2, 3)).toEqual(board.cells[2][3]);
    });
    it("should do boundary checking", function() {
      expect(function() {
        board.get_cell(20, 9)
      }).toThrow();
    });
  });

  describe("#clear", function() {
    it("should clear the board", function() {
      board.play_white(5, 2);
      board.clear();
      _.each(board.cells, function(column) {
        _.each(column, function(cell) {
          expect(cell.is_empty()).toEqual(true);
        });
      });
    });
  });

  describe("game play", function() {
    it("should let you alternate", function() {
      expect(board.play_black(4,4)).toEqual(true);
      expect(board.play_white(2,4)).toEqual(true);
    });

    it("shouldn't let you play the same color twice in a row", function() {
      expect(board.play_black(4,4)).toEqual(true);
      expect(function() {
        board.play_black(2,4);
      }).toThrow(new weiqi.IllegalMoveError("It's not your turn."));
    });

    it("it should let you play a color, clear the board, and play that color again", function() {
      expect(board.play_black(4,4)).toEqual(true);
      board.clear()
      expect(board.play_black(4,4)).toEqual(true);
    });

    it("should let you play on an empty cell", function() {
      expect(board.get_cell(5, 4).is_empty()).toBeTruthy();
      expect(board.play_black(5, 4)).toBeTruthy();
    });

    it("should not let you play on a full cell", function() {
      board.play_black(5, 4);
      expect(board.get_cell(5, 4).is_empty()).toBeFalsy();
      expect(function() {
        board.play_white(5, 4);
      }).toThrow(new weiqi.IllegalMoveError('Can only play in empty cells.'));
    });
  });

  describe("counting moves", function() {
    it("move_count should increment with each move", function() {
      board.play_white(2,4)
      board.play_black(4,4)
      expect(board.get('move_count')).toEqual(2)
    });
  });

  describe("serialization", function() {
    it("should be able to serialize the board state to json", function() {
      board.play_black(0, 1);
      var attributes = JSON.parse(JSON.stringify(board.toJSON()));
      expect(attributes.width).toEqual(19);
      expect(attributes.cells.length).toEqual(19);
      expect(attributes.cells[0].length).toEqual(19);
      expect(attributes.cells[0][1]['holds']).toEqual("black");
      expect(attributes.cells[0][0]['holds']).toEqual(null);
    });

    it("should be able to hydrate from the serialization", function() {
      board.play_white(0, 1);
      expect(board.get_cell(0, 1).is_empty()).toBeFalsy();
      expect(board.get_cell(0, 0).is_empty()).toBeTruthy();

      var attributes = JSON.parse(JSON.stringify(board));
      
      var new_board = new weiqi.Board();
      new_board.parse(attributes);
      expect(new_board.get_cell(0, 1).is_empty()).toBeFalsy();
      expect(new_board.get_cell(0, 0).is_empty()).toBeTruthy();
    });
  });

  describe("#url", function(){
    describe("when it has an id", function() {
      it("should append 'json'", function(){
        var new_board = new weiqi.Board({id: 123});
        expect(new_board.url()).toBe("/boards/123.json");
      });
    });
  });

});
