if(!(typeof exports == "undefined")){
  require('../../lib/weiqi-models.js');
  require('jasmine-node');
}

describe("MoveCollection", function() {
  describe("#is_same_as_last_move", function() {
    var board,
        moves,
        black_move,
        white_move;
    beforeEach(function() {
      board = new weiqi.Board();
      moves = new weiqi.MoveCollection([], {board: board});
      black_move = new weiqi.Move({x: 1, y: 1, color: "black"});
      white_move = new weiqi.Move({x: 2, y: 2, color: "white"});
      another_black_move = new weiqi.Move({x: 3, y: 3, color: "black"});
    });

    describe("when this is the first move", function() {
      it("should return false", function() {
        expect(moves.is_same_as_last_move(black_move)).toBe(false);
      });
    });
   
    describe("when there are existing moves", function() { 
      beforeEach(function() {
        moves.add(black_move);
        moves.add(white_move);
      });
      describe("when the next move is different", function() {
        it("should return false", function() {
          expect(moves.is_same_as_last_move(another_black_move)).toBe(false);
        });
      });
      describe("when the next move is the same", function() {
        it("should return true", function() {
          var same_black_move = new weiqi.Move({x: 1, y: 1, color: "black"});
          expect(moves.is_same_as_last_move(same_black_move)).toBe(true);
        });
      });
    });
  });
});
