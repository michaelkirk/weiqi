var assert = require("assert");
var weiqi = require('../../../../lib/weiqi-models.js');


describe("Board", function() {
  describe("#create", function() {
    it("generates an id", function() {
      var board = new weiqi.Board();
      board.save();
      var mongo_id_regex =/^[0-9a-f]{24}$/
      assert.ok(board.id.match(mongo_id_regex), "board id didn't look like a mongo id");
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

    it("should create an invitation", function(done) {
      var board = new weiqi.Board();
      board.save().then(function() {
        assert(board.get('invitation_id'), 'invitation id not set');
        var invitation = new weiqi.Invitation({ _id: board.get('invitation_id') });
        invitation.fetch().then(function() {
          assert.equal(invitation.get('board_id'), board.id, "invitation's board_id didn't match board's id");
          done();
        });
      }).fail(function(error) {
        console.log("failure:" + error);
      });
    });
  });

  describe("#find_white_player", function() {
    it("should fetch a white player", function(done) {
      var board = new weiqi.Board();
      board.save().then(function() {
        return board.find_white_player();
      }).then(function(white_player_result) {
        var mongo_id_regex =/^[0-9a-f]{24}$/
        assert.ok(white_player_result.id.match(mongo_id_regex), "white_player_id didn't look like a mongo id");
        done();
      }).fail(function(error) {
        console.log("failure:" + error);
      });
    });
  });
});
