if(!(typeof exports == "undefined")){
  require('../../lib/weiqi-models.js');
  require('jasmine-node');
}

describe("Game", function() {

  var board = null;
  var black = null;
  var white = null;

  beforeEach(function() {
    var boardLoaded = false;
    runs(function(){
      board = new weiqi.Board();
      board.save().done(function(){
        black = new weiqi.game(board.toJSON(), "black");
        white = new weiqi.game(board.toJSON(), "white");
        boardLoaded = true;
      });
    });
    waitsFor(function(){
      return boardLoaded;
    }, 'the tests to be set up', 1500)
  });

  it("should have a board attribute", function() {
    expect(white.board).toBeTruthy()
    expect(black.board).toBeTruthy()
  });

 it("should make opponents wait for their turn", function(){
  var testReady = false;
  white.board.on('board-updated', function(){
    testReady = true;
  })
  runs(function(){
    black.board.play_black(1, 1);
  });
  waitsFor(function(){return testReady;}, 'the move to propagate to the other game', 750);
  runs(function(){
    expect(black.board.whose_turn()).toBe('white')
    expect(white.board.whose_turn()).toBe('white')
  })

 });


});
