var assert = require("assert");
var Player = require('../../../../lib/weiqi-models').Player;
var mongo_promise = require('../../../../lib/persistence/mongo/client.js');

describe("Player", function() {
  var mock_board_id = "fake-boarduid-----------"

  //clean up any created test data
  beforeEach(function(done){
    Player.find_by_board_id_and_color(mock_board_id, 'black').then(function(player){
      return player.delete();
    }).then(function(){
      done();
    }).fail(function(error){
      done(error);
    })
  })

  describe("#create", function() {
    it('is possible to fetch a created Player', function(done) {
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
  });

  describe(".find_by_board_id_and_color", function() {
    it("finds an existing player", function(done) {
      var player = new Player({ board_id: mock_board_id, color: "black" });
      var found_player;
      player.save().then(function(saved_attributes) {
        return Player.find_by_board_id_and_color(mock_board_id, "black");
      }).then(function(fetched_player){
        found_player = new Player(fetched_player)
        return found_player.fetch()
      }).then(function(fetched_attributes) {
        assert.ok(fetched_attributes, "couldn't find player");
        assert.equal(fetched_attributes._id, player.id, "didn't find the right player");
        done();
      }).fail(function(error) {
        console.log("failure:" + error);
      });
    });
  });
});
