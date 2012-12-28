Zombie = require('zombie');
assert = require('assert');

var browser = new Zombie({ site: 'http://localhost:3000', silent: true});
browser.on("error", function(error) {
  report("ERROR> " + error);
})

function report(msg) {
  if (true) {
    console.log("test> " + msg);
  }
}

describe("Weiqi", function() {
  it("should have a running server", function(done) {
    browser
      .visit("/")
      .then(function() {
        assert.ok(browser.success);
        done();
      });
  });
});

function player_id(browser){
  return browser.location.pathname.match(/^\/boards\/([a-f0-9\-]+)$/)[1];
}

function board_url(player_id){
  return "http://localhost:3000" + board_path(player_id);
}

function board_path(player_id){
  return "/boards/" + player_id;
}

function play_piece(index, options) {
  options = options || {};

  var playing_browser = options['browser'] || browser;

  var cell_element = playing_browser.querySelector('#app .board .jgo_c:nth-child(' + index + ')');
  report('trying to place a stone.');
  return playing_browser.fire('click', cell_element);
}

function class_for_color(color) {
  if (color == "white") {
    return "jgo_w";
  } else if (color == "black") {
    return "jgo_b";
  } else {
    throw Error("unknown color: " + color);
  }
}


function assert_piece_played(index, options) {
  options = options || {};

  var playing_browser = options['browser'] || browser;
  var color = options['color'];
  var color_class = class_for_color(color);
  var query_string = '#app .board .jgo_c:nth-child(24).' + color_class;

  report('searching for stone at ' + query_string);
  assert.ok(playing_browser.query(query_string), "couldn't find stone");
  report('stone found.');
}

function make_board(the_browser){
  // TODO replace with something like:
  //    return weiqi.Board.create();
  return the_browser.visit("/boards")
    .then(function(){
      assert.ok(the_browser.success);
      assert.ok(the_browser.query("input[type='submit'][value='start a game']"));
      report('successfully rendered board creation form.');
      return the_browser.pressButton("start a game"); 
    })
    .then(function(){
      assert.ok(the_browser.success);
      assert.ok(the_browser.location.pathname.match(/^\/boards\/[a-f0-9\-]+$/));
      report('successfully redirected to new board.');
      return player_id(the_browser);
    });
};

describe("Boards", function() {
  describe("#show", function() {
    it("should render the current players color", function(done) {
      make_board(browser).then(function() {
        assert.equal(browser.text("h1"), "white");
        done();
      })
      .fail(function(error){
        report("test failure: " + error);
      });
    });

    it("should 404 when accessing a bogus board", function(done) {
      browser
        .visit("/boards/bogus-id-that-doesn't-exist/back")
        .then(function() {
          assert(false, "Should have 404'd");
        })
        .fail(function() {
          assert(!browser.success);
          assert.equal(browser.statusCode, '404');
          done();
        });
    });
  });

  function extract_link_from_node(node) {
    // This is a pretty specific hack
    // which currently only works with relative URLs
    return "http://localhost:3000" + node._attributes.href._nodeValue
  };

  function extract_invite_url(browser) {
    return extract_link_from_node(browser.query("#app .share .black a"));
  }
  
  function follow_invite(browser) {
    var invite_black_url = extract_invite_url(browser);
    return browser.visit(invite_black_url);
  }

  it("should create a playable game", function(done) {
    make_board(browser)
      .then(function(player_id) { return follow_invite(browser) })
      .then(function() {
        assert.ok(browser.success);
        assert.ok(browser.query('#app .board .jgo_c:nth-child(24)'));
        report('successfully rendered new board.');
      })
      .then(function() {
        return play_piece(24);
      })
      .then(function() {
        assert.ok(browser.success);
        assert_piece_played(24, { color: "black" });
        report('successfully placed a stone.');
        return player_id(browser);
      })
      .then(function(player_id) {
        return browser.reload();
      })
      .then(function(){
        assert.ok(browser.success);
        assert_piece_played(24, { color: "black" });
        report('successfully saved and reloaded the board intact');
      })
      .then(function(){
        done();
      })
      .fail(function(error){
        report("test failure: " + error);
      });
  });


  it("should syndicate updates to everyone watching.", function(done) {
    var black_browser = new Zombie({ site: 'http://localhost:3000', silent: false});
    var white_browser = new Zombie({ site: 'http://localhost:3000', silent: false});
    make_board(white_browser)
      .then(function(the_player_id) {
        return black_browser.visit(extract_invite_url(white_browser));
      }).then(function() {
        return play_piece(24, { browser: black_browser });
      }).then(function() {
        // wait for white browser to get boards-updated notification
        // and re-render
        return white_browser.wait();
      }).then(function() {
        assert_piece_played(24, { browser: black_browser, color: "black" });
        assert_piece_played(24, { browser: white_browser, color: "black" });
        done();
      }).fail(function(error) {
        report("test failure: " + error);
      });
  });

  it("should only syndicate to browsers watching the game", function(done) {
    var black_browser = new Zombie({ site: 'http://localhost:3000', silent: false});
    var other_game_browser = new Zombie({ site: 'http://localhost:3000', silent: false});
    
    //initialize to false, verify at the end that it's still false
    other_game_browser.was_updated = false;

    make_board(other_game_browser)
      .then(function() {
        // after loading the page, listen for board-updates.
        other_game_browser.window.frames.addEventListener('board-update', function() {
          other_game_browser.was_updated = true;
        });
      }).then(function() {
        return make_board(black_browser);
      }).then(function(the_player_id) {
        return follow_invite(black_browser);
      }).then(function() {
        return play_piece(24, { browser: black_browser });
      }).then(function() {
        // wait for browser to send board-update notification
        return black_browser.wait();
      }).then(function() {
        // wait for browser to get any board-update notification
        assert(! other_game_browser.was_updated, "other game should not receive board-update");
        done();
      }).fail(function(error) {
        report("test failure: " + error);
      });
  });


  describe("invitiation flow", function() {
    it("should have an invitation flow", function(done) {
      var black_browser = new Zombie({ site: 'http://localhost:3000', silent: false});
      var white_browser = new Zombie({ site: 'http://localhost:3000', silent: false});
      make_board(white_browser)
        .then(function(player_id) {
          var invite_black_url = extract_invite_url(white_browser);
          return black_browser.visit(invite_black_url);
        })
        .then(function() {
          return play_piece(24, { browser: black_browser });
        })
        .then(function() {
          return white_browser.wait();
        })
        .then(function() {
          assert_piece_played(24, { color: "black", browser: white_browser });
          done();
        })
        .fail(function(error) {
          report("test failure: " + error);
        });
    });

    it("should only allow the first person to visit the invitation url", function(done) {
      var black_browser = new Zombie({ site: 'http://localhost:3000', silent: false});
      var white_browser = new Zombie({ site: 'http://localhost:3000', silent: false});
      var test_world = {};
      make_board(white_browser)
        .then(function(player_id) {
          test_world.invite_black_url = extract_invite_url(white_browser);
          return black_browser.visit(test_world.invite_black_url);
        })
        .then(function() {
          return white_browser.visit(test_world.invite_black_url);
        })
        .then(function() {
          //assert that white player was denied.
          assert.ok(white_browser.text("#app").match(/already claimed/), "only first visit should claim an invitation");
          done();
        })
        .fail(function(error) {
          report("test failure: " + error);
        });
    });

  });
});


