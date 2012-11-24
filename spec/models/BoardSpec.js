if(!(typeof exports == "undefined")){
  require('../../lib/weiqi-models.js');
  require('jasmine-node');
}

describe("Board", function() {
  var board = null;
  beforeEach(function(done) {
    board = new weiqi.Board();
    board.save().done(function(){
      done() 
    })    
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
      board.play_black(5, 2);
      board.clear();
      _.each(board.cells, function(column) {
        _.each(column, function(cell) {
          expect(cell.is_empty()).toEqual(true);
        });
      });
    });
  });

  describe("game play", function(done) {
    it("should let you alternate", function() {

      var failSpy = jasmine.createSpy();

      board.play_black(4,4).done(done).fail(failSpy)
      board.play_white(2,4).done(done).fail(failSpy)

      expect(failSpy).not.toHaveBeenCalled()

    });

    it("shouldn't let you play the same color twice in a row", function() {

      board.play_black(4,4)
      expect(function() {
        board.play_black(2,4);
      }).toThrow(new weiqi.IllegalMoveError("It's not your turn."));
    });

    it("it should let you play a color, clear the board, and play that color again", function() {

      board.play_black(4,4)
      board.clear()
      expect(board.play_black(4,4)).toBeTruthy();

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

    it("should not let white play first", function() {
      expect(function() {
        board.play_white(5, 4);
      }).toThrow(new weiqi.IllegalMoveError("It's not your turn."));
    });

    describe("liberties", function(){
      it("should remove dead groups", function(){
        board.play_black(0, 1);
        board.play_white(1, 1);
        board.play_black(2, 1);
        board.play_white(9, 1);
        board.play_black(1, 0);
        board.play_white(9, 2);
        board.play_black(1, 2);
        expect(board.get_cell(1, 1).is_empty()).toBe(true);
      });

      it("should give first-strike to just-played piece", function(){
        // Set up board thus
        // .O@...
        // O@....
        // @.....
        board.play_black(0, 2);
        board.play_white(0, 1);
        board.play_black(1, 1);
        board.play_white(1, 0);
        board.play_black(2, 0);
        board.play_white(9, 9); // irrelevant

        // Playing B at 0,0 should remove the W stones, 
        // but the B stone at 0,0 should remain
        board.play_black(0, 0);
        expect(board.get_cell(0, 1).is_empty()).toBe(true);
        expect(board.get_cell(1, 0).is_empty()).toBe(true);
        expect(board.get_cell(0, 0).is_empty()).toBe(false);
      });

      it("should clear legitimate suicides", function(){
        // Set up board thus
        // .@....
        // @.....
        // ......
        board.play_black(0, 1);
        board.play_white(10, 12); //irrelevant
        board.play_black(1, 0);

        // Playing W at 0,0 should remove the W stone 
        board.play_white(0, 0);
        expect(board.get_cell(0, 1).is_empty()).toBe(false);
        expect(board.get_cell(1, 0).is_empty()).toBe(false);
        expect(board.get_cell(0, 0).is_empty()).toBe(true);
      });
    });
    describe('moves', function(){
      it("should accumulate a list of moves", function(){
        board.play_black(0, 1);
        board.play_white(10, 12);
        board.play_black(1, 0);
        board.play_white(0, 0);
        expect(board.moves.length).toBe(4)
 
      });
      it("should order the moves in the way they were played", function(){
        var moves = [
          {color:'black', x:0,  y:1}, 
          {color:'white', x:10, y:12}, 
          {color:'black', x:1,  y:0}, 
          {color:'white', x:0,  y:0} 
        ];
        moves = _(moves).map(function(move_data){
          return new weiqi.Move(move_data);
        });
        _(moves).each(function(move){
          move.apply_to(board)
        });
        expect(moves.length).toBe(board.moves.length);
        for(i=0; i<moves.length; i++){
          expect(moves[i].get('x')).toBe(board.moves.models[i].get('x'));
          expect(moves[i].get('y')).toBe(board.moves.models[i].get('y'));
          expect(moves[i].get('color')).toBe(board.moves.models[i].get('color'));
        };
      });
    });
  });

  describe("#stone_cell_groups", function() {
    describe("when the board is empty", function() {
      it("should be empty", function() {
        expect(board.stone_cell_groups()).toEqual([]);
      });
    });
    describe("when the board has one stone", function() {
      it("should have a single group containing the stone", function() {
        board.get_cell(0, 0).play("white");
        expect(board.stone_cell_groups()).toEqual([new weiqi.Board.Group([board.get_cell(0,0)])]);
      });
    });
    describe("when the board has a bunch of disjoint stones", function() {
      it("should group them all individually", function() {
        board.get_cell(0, 0).play("white");
        board.get_cell(2, 2).play("black");
        board.get_cell(4, 4).play("white");
        board.get_cell(6, 6).play("black");
        expect(board.stone_cell_groups().length).toBe(4);
      });
    });
    describe("when adjacent stones have the same color", function() {
      it("should group them", function() {
        //board.play_white(0, 0);
        board.get_cell(0, 0).play("white");
        //board.play_black(0, 1);
        board.get_cell(9, 9).play("black" );
        //board.play_white(1, 1);
        board.get_cell(0, 1).play("white" );
        expect(board.stone_cell_groups().length).toBe(2);
      });
    });
    describe("when adjacent stones have a different color", function() {
      it("should not group them", function() {
        //board.play_white(0, 0);
        board.get_cell(0, 0).play("white");
        //board.play_black(0, 1);
        board.get_cell(0, 1).play("black" );
        //board.play_white(1, 1);
        board.get_cell(9, 9).play("white" );
        expect(board.stone_cell_groups().length).toBe(3);
      });
    });
  });

  describe("counting moves", function() {
    it("the number of moves should increment with each move", function() {
      board.play_black(4,4)
      board.play_white(2,4)
      expect(board.moves.length).toEqual(2)
    });

    it("the moves should retain their order and values", function() {
      board.play_black(4,4)
      board.play_white(2,4)
      expect(board.moves.length).toEqual(2)
      expect(board.moves.models[0].attributes.x).toEqual(4)
      expect(board.moves.models[0].attributes.y).toEqual(4)
      expect(board.moves.models[0].attributes.color).toEqual('black')
      expect(board.moves.models[1].attributes.x).toEqual(2)
      expect(board.moves.models[1].attributes.y).toEqual(4)
      expect(board.moves.models[1].attributes.color).toEqual('white')
    });

  });

  describe("serialization", function() {
    it("should be able to serialize the board state to json", function() {
      var attributes = JSON.parse(JSON.stringify(board.toJSON()));
      expect(attributes.cells[0][0]['holds']).toEqual(null);
      board.play_black(0, 1);
      var attributes = JSON.parse(JSON.stringify(board.toJSON()));
      expect(attributes.width).toEqual(19);
      expect(attributes.cells.length).toEqual(19);
      expect(attributes.cells[0].length).toEqual(19);
      expect(attributes.cells[0][1]['holds']).toEqual("black");
      expect(attributes.cells[0][0]['holds']).toEqual(null);
    });

    it("should be able to hydrate from the serialization", function() {
      board.play_black(0, 1);
      expect(board.get_cell(0, 1).is_empty()).toBeFalsy();
      expect(board.get_cell(0, 0).is_empty()).toBeTruthy();

      var attributes = JSON.parse(JSON.stringify(board));
      
      var new_board = new weiqi.Board(attributes);
      expect(new_board.get_cell(0, 1).is_empty()).toBeFalsy();
      expect(new_board.get_cell(0, 0).is_empty()).toBeTruthy();
    });
  });

  describe("#stone_cells", function() {
    describe("when the board is empty", function() {
      it("should have no stone_cells", function() {
        expect(board.stone_cells()).toEqual([]);
      });
    });
    it("should return all the stone_cells on the board", function() {
      //board.play_white(0, 0);
      board.get_cell(0, 0).play("white");
      
      //board.play_black(0, 1);
      board.get_cell(0, 1).play("black" );
      
      //board.play_white(1, 1);
      board.get_cell(1, 1).play("white" );
      
      //board.play_black(0, 2);
      board.get_cell(0, 2).play("black" );
      
      //board.play_white(18, 9);
      board.get_cell(18, 9).play("white");
      
      //board.play_black(0, 3);
      board.get_cell(0, 3).play("black");
      
      expect(board.stone_cells().length).toBe(6);

      //spot checks
      expect(
        _.select(board.stone_cells(), function(stone_cell) { return stone_cell.get('x') == 0 })
          .length).toBe(4);

      var stone_cell = _.detect(board.stone_cells(), function(stone_cell) { return stone_cell.get('x') == 18 });
      expect(stone_cell.get('y')).toBe(9);
    });
  });

  describe("#url", function(){
    describe("when it has an id", function() {
      it("should append '.json'", function(){
        var new_board = new weiqi.Board({id: 123});
        expect(new_board.url()).toBe("/boards/123.json");
      });
    });
  });

  describe("#black_player_url", function(){
    describe("when it has an id", function() {
      it("should append '/black'", function(){
        var new_board = new weiqi.Board({id: 123});
        expect(new_board.black_player_url()).toBe("/boards/123/black");
      });
    });
  });

  describe(".Group", function() {
    describe("#merge", function() {
      it("should combine the stone cells between the two groups", function() {
        var board = new weiqi.Board(),
        a = new weiqi.Cell({ board: board }),
        b = new weiqi.Cell({ board: board }),
        c = new weiqi.Cell({ board: board }),
        d = new weiqi.Cell({ board: board });

        var first_stone_cell_group = new weiqi.Board.Group([a]);
        var second_stone_cell_group = new weiqi.Board.Group([c, d]);
        var combined_stone_cell_group = first_stone_cell_group.merge(second_stone_cell_group);

        expect(combined_stone_cell_group.stone_cells.length).toBe(3);
      });
    });
  });

});
