if(!(typeof exports == "undefined")){
  require('../../lib/weiqi-models.js');
  require('jasmine-node');
}

describe("Cell", function() {
  var board = new weiqi.Board();
  var cell = new weiqi.Cell({x:1, y:2, board: board});

  describe("#is_empty", function() {
    it("should start as empty", function() {
      expect(cell.is_empty()).toEqual(true);
    });
    describe("after playing a piece", function() {
      it("should not be empty", function() {
        cell.play('black');
        expect(cell.is_empty()).toEqual(false);
      });
    });
  });

  describe("#play", function() {
    describe("when the cell is empty", function() {
      beforeEach(function() {
        cell.set('holds', null);
      });

      describe("when playing black", function(){
        it("should succeed", function() {
          expect(cell.play('black')).toEqual(true);
        });
      });
      describe("when playing white", function(){
        it("should succeed", function() {
          expect(cell.play('white')).toEqual(true);
        });
      });
      describe("when playing something bogus", function(){
        it("should succeed", function() {
          expect(function() {
            cell.play('baz')
          }).toThrow();
        });
      });
      it("should update the board's attributes", function() {
        expect(board.get('cells')[1][2].holds).toBe(null);
        cell.play("black")
        expect(board.get('cells')[1][2].holds).toBe("black");
      });
    });
    describe("when the cell is not empty", function() {
      beforeEach(function() {
        cell.set('holds', 'black');
      })
      it("should error", function() {
        expect(function() {
          cell.play('black')
        }).toThrow(new weiqi.IllegalMoveError("Can only play in empty cells."));
      });
    });
  });
});
