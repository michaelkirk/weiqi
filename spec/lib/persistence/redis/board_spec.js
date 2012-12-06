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

    it("should make a black and white player", function(done) {
      var board = new weiqi.Board();

      board.create().then(function() {
        return weiqi.Player.white_player_for_board_id(board.id);
      }).then(function(white_player) { // <-- is this a promise or a player? mind melting for now.
        assert.ok(white_player, "no white player was created");

        return weiqi.Player.black_player_for_board_id(board.id);
      }).then(function(black_player) {
        assert.ok(black_player, "no black player was created");
        done();
      }).fail(function(error) {
        console.log("failure:" + error);
      });
    });
  });
});
