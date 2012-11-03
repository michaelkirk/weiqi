Zombie = require('zombie');
assert = require('assert');

browser = new Zombie({ site: 'http://localhost:3000', silent: true });
browser.on("error", function(error) {
  report("ERROR> " + error);
})

function report(msg) {
  if (false) {
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
      })
  });
});

describe("Boards", function() {
  it("should create a playable game", function(done) {
     browser
      .visit("/boards")
      .then(function(){ 
        assert.ok(browser.success);
        assert.ok(browser.query("input[type='submit'][value='start a new game']"));
        return browser.pressButton("start a new game"); 
      })
      .then(function(){
        assert.ok(browser.success);
        assert.ok(browser.redirected);
        assert.ok(browser.location.pathname.match(/^\/boards\/[0-9]+$/));
        report('successfully redirected to new board.');
        var board_id = browser.location.pathname.match(/^\/boards\/([0-9]+)$/)[1];
        return board_id
      })
      .then(function(board_id) { return browser.visit("/boards/" + board_id); })
      .then(function() {
        assert.ok(browser.success);
        assert.ok(browser.query('#black .board .jgo_c:nth-child(24)'));
        report('successfully rendered new board.');
      })
      .then(function() { 
        var cell_element = browser.querySelector('#black .board .jgo_c:nth-child(24)');
        report('trying to place a stone.');
        return browser.fire('click', cell_element);
      })
      .then(function() {
        assert.ok(browser.success);
        assert.ok(browser.query('#black .board .jgo_c:nth-child(24).jgo_b'));
        report('successfully placed a stone.');
        var board_id = browser.location.pathname.match(/^\/boards\/([0-9]+)$/)[1];
        return board_id;
      })
      .then(function(board_id) {
        return browser.visit("/boards/" + board_id);
      })
      .then(function(){
        assert.ok(browser.success);
        assert.ok(browser.query('#black .board .jgo_c:nth-child(24).jgo_b'));
        report('successfully saved and reloaded the board intact');
      })
      .then(function(){
        done();
      });
  });
});


