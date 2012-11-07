Zombie = require('zombie');
assert = require('assert');

browser = new Zombie({ site: 'http://localhost:3000', silent: true});
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

function board_id(browser){
  return browser.location.pathname.match(/^\/boards\/([a-f0-9\-]+)\/black$/)[1];
}

function board_url(board_id){
  return "http://localhost:3000" + board_path(board_id);
}
function board_path(board_id){
  return "/boards/" + board_id + "/black";
}

describe("Boards", function() {
  it("should create a playable game", function(done) {
     browser
      .visit("/boards")
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
        assert.ok(browser.location.pathname.match(/^\/boards\/[a-f0-9\-]+\/black$/));
        report('successfully redirected to new board.');
        return board_id(browser);
      })
      .then(function(board_id) { return browser.visit(board_path(board_id)); })
      .then(function() {
        assert.ok(browser.success);
        assert.ok(browser.query('#app .board .jgo_c:nth-child(24)'));
        report('successfully rendered new board.');
      })
      .then(function() { 
        var cell_element = browser.querySelector('#app .board .jgo_c:nth-child(24)');
        report('trying to place a stone.');
        return browser.fire('click', cell_element);
      })
      .then(function() { //  <- FIXME this takes a long while (~10s) to fire.
        assert.ok(browser.success);
        assert.ok(browser.query('#app .board .jgo_c:nth-child(24).jgo_b'));
        report('successfully placed a stone.');
        return board_id(browser);
      })
      .then(function(board_id) {
        return browser.visit(board_path(board_id));
      })
      .then(function(){
        assert.ok(browser.success);
        assert.ok(browser.query('#app .board .jgo_c:nth-child(24).jgo_b'));
        report('successfully saved and reloaded the board intact');
      })
      .then(function(){
        done();
      })
      .fail(function(error){
        report("test failure: " + error);
      });
  });
});


