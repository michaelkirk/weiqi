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

function board_id(browser){
  return browser.location.pathname.match(/^\/boards\/([a-f0-9\-]+)\/(black|white)$/)[1];
}

function board_url(board_id){
  return "http://localhost:3000" + board_path(board_id);
}

function board_path(board_id, options){
  var options = options || {};
  var color = options['color'] || "black";
  return "/boards/" + board_id + "/" + color;
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

function make_board(browser){
  // TODO replace with something like:
  //    return weiqi.Board.create();
  return browser.visit("/boards")
    .then(function(){
      assert.ok(browser.success);
      assert.ok(browser.query("input[type='submit'][value='start a new game']"));
      report('successfully rendered board creation form.');
      return browser.pressButton("start a new game"); 
    })
    .then(function(){
      assert.ok(browser.success);
      assert.ok(browser.redirected);
      report('redirected to: ' + browser.location.pathname);
      assert.ok(browser.location.pathname.match(/^\/boards\/[a-f0-9\-]+\/white$/));
      report('successfully redirected to new board.');
      return board_id(browser);
    });
};



describe("Boards", function() {
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

  it("should create a playable game", function(done) {
    make_board(browser)
      .then(function(board_id) { return browser.visit(board_path(board_id)); })
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
        return board_id(browser);
      })
      .then(function(board_id) {
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
    make_board(black_browser)
      .then(function(the_board_id) {
        return black_browser.visit(board_path(the_board_id, { color: "black" }))
      }).then(function() {
        return white_browser.visit(board_path(board_id(black_browser), { color: "white" }));
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
});


