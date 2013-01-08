var weiqi = require('../lib/weiqi-models.js')

module.exports = {
  show: function(request, response) {
    var invitation = new weiqi.Invitation({ id: request.params.id });
    var board;
    invitation.fetch().then(function() {
      if (invitation.is_claimed()) { 
        var already_claimed_message = "This invitation was already claimed. If you lost the link, you'll have to start a new game."
        response.status(500);
        return response.render("errors/500", { error: already_claimed_message });
      } else {
        return invitation.claim().then(function() {
          var board_id = invitation.get('board_id');
          board = new weiqi.Board({ id: board_id });
          return board.fetch();
        }).then(function() {
          return board.find_black_player_id();
        }).then(function(black_player_id) {
          response.redirect(302, "/boards/" + black_player_id);
        }).done();
      }
    }).done();
  }
};

