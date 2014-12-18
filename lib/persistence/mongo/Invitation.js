var Backbone = require('backbone');

module.exports = function(weiqi) {

  var BaseInvitation = require('./Base')({model: Backbone.Model, name: 'invitation'});

  weiqi.Invitation = BaseInvitation.extend({
    collection_name: "invitations",
    is_claimed: false,
    claim: function() {
      if( this.is_claimed() ) { throw new Error("Already claimed") };

      this.set({ is_claimed: true })
      return this.save();
    },
    is_claimed: function() {
      return this.get('is_claimed');
    }
  });

  return weiqi;
};
