if(!(typeof exports == "undefined")){
  require('../../lib/weiqi-models.js');
  require('jasmine-node');
}

describe("StoneCellGroup", function() {
  describe("#merge", function() {
    it("should combine the stone cells between the two groups", function() {
      var board = new weiqi.Board(),
          a = new weiqi.Cell({ board: board }),
          b = new weiqi.Cell({ board: board }),
          c = new weiqi.Cell({ board: board }),
          d = new weiqi.Cell({ board: board });

      var first_stone_cell_group = new weiqi.StoneCellGroup([a]);
      var second_stone_cell_group = new weiqi.StoneCellGroup([c, d]);
      var combined_stone_cell_group = first_stone_cell_group.merge(second_stone_cell_group);

      expect(combined_stone_cell_group.stone_cells.length).toBe(3);
    });
  });
});
