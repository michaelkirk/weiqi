var assert = require("assert");
var Player = require('../../../../lib/weiqi-models').Player;

describe("Player", function() {

  describe("#create", function() {
    it("should run", function() {
      assert.ok(new Player());
    });
  });

});
