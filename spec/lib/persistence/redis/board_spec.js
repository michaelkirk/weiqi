var assert = require("assert");
var weiqi = require('../../../../lib/weiqi-models.js');

describe("Board", function() {
  describe("#create", function() {
    it("should have a UUID pk", function() {
      var board = new weiqi.Board();
      board.save();
      var uuid_regex =/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      assert.ok(board.id.match(uuid_regex), "board id didn't look like a UUID");
    });

    it("should make a black and white player", function(done) {
      var board = new weiqi.Board();

      board.save().then(function() {
        return weiqi.Player.find_by_board_id_and_color(board.id, "white");
      }).then(function(white_player) {
        assert.ok(white_player, "no white player was created");

        return weiqi.Player.find_by_board_id_and_color(board.id, "black");
      }).then(function(black_player) {
        assert.ok(black_player, "no black player was created");
        done();
      }).fail(function(error) {
        console.log("failure:" + error);
      });
    });
  });

  describe("#white_player_id", function() {
    it("should fetch it's white player's id", function(done) {
      var board = new weiqi.Board();
      board.save().then(function() {
        return board.white_player_id();
      }).then(function(white_player_id) {
        var uuid_regex =/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
        assert.ok(white_player_id.match(uuid_regex), "white_player_id didn't look like a UUID");
        done();
      }).fail(function(error) {
        console.log("failure:" + error);
      });
    });
  });
});
