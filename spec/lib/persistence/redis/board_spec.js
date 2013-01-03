var assert = require("assert");
var weiqi = require('../../../../lib/weiqi-models.js');

describe("Board", function() {
  describe("#create", function() {
    it("should have a UUID pk", function() {
      var board = new weiqi.Board();
      board.create();
      var uuid_regex =/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      assert.ok(board.id.match(uuid_regex), "board id didn't look like a UUID");
    });
  });

});
