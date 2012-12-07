var assert = require("assert");
var Player = require('../../../../lib/weiqi-models').Player;

describe("Player", function() {

  describe("#create", function() {
    it('should be possible to create and fetch a Player', function(done) {
      var mock_board_id = "fake-board-id5"
      var player = new Player({ board_id: mock_board_id, color: "black" });
      player.save().then(function() {
        return player.fetch()
      }).then(function() {
        assert.ok(player, "couldn't find player");
        assert.equal(player.get('board_id'), mock_board_id);
        done();
      }).fail(function(error) {
        console.log("failure:" + error);
      });
    });

    it("should create a key to lookup by board id and color", function(done) {
      var mock_board_id = "fake-board-id3"
      var player = new Player({ board_id: mock_board_id, color: "black" });
      var found_player;
      player.save().then(function() {
        return Player.find_by_board_id_and_color(mock_board_id, "black");
      }).then(function(the_found_player){
        found_player = the_found_player;
        return found_player.fetch()
      }).then(function() {
        assert.ok(found_player, "couldn't find player");
        assert.equal(found_player.id, player.id, "didn't find the right player");
        done();
      }).fail(function(error) {
        console.log("failure:" + error);
      });
    });
  });
  
  describe(".id_for_board_id_and_color", function() {
    it("should look up the id of the player given their color and board id", function(done) {
      var player = new Player({ board_id: "fake-board-id2", color: "black" });
      player.save().then(function() {
        return Player.id_for_board_id_and_color("fake-board-id2", "black");
      }).then(function(player_id) {
        assert.equal(player_id, player.id);
        done();
      }).fail(function(){
        console.log("failure:" + error);
      });
    });
  });

});
