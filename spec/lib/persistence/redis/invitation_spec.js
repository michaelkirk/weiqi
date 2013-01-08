var assert = require("assert");
var Invitation = require('../../../../lib/weiqi-models').Invitation;

describe('Invitation', function() {
  var invitation;
  beforeEach(function() {
    invitation = new weiqi.Invitation();
  });

  describe("#is_claimed", function() {
    it("should start as false", function() {
      assert.equal(invitation.is_claimed(), false, 'invitation should start as unclaimed');
    });

    it("should reflect it's attribute", function() {
      invitation.set({ is_claimed: true });
      assert(invitation.is_claimed(), true);
    });
  });

  describe("#claim", function() {
    it("should mark as claimed", function(done) {
      invitation.claim().then(function() {
        assert(invitation.is_claimed(), true);
        done();
      });
    });

    describe("when it's already been claimed", function() {
      it("should error", function(done) {
        invitation.claim();
        assert.throws(function(){
          invitation.claim();
        }, /already claimed/i);
        done()
      });
    });
  });
});
