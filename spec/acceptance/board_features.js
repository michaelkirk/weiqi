Zombie = require('zombie');
assert = require('assert');

browser = new Zombie({ site: 'http://localhost:3000' });
browser.on("error", function(error) {
  report("ERROR> " + error);
})

function report(msg) {
  console.log("test> " + msg);
}

function run_suite() {
  report('Starting acceptance suite...');
  test_server_up()
  .then(test_boards)
  .then(function() {
    report("SUCCESS! ^_^ GOOD JOB!");
    process.exit(0);
  }).fail(function(error) {
    report("FAILED with: ``" + error + "''");
    process.exit(1);
  });
}

function test_server_up(){
  return browser
    .visit("/")
    .then(function() {
      assert.ok(browser.success);
    })
    .fail(function(){
      report("The server must be up in order to run the suite.");
    });
}

function test_boards( ){
  return browser
    .visit("/boards")
    .then(function(){ 
      report("successfully loaded board creation button");
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
      assert.ok(browser.query('#black .board .jgo_c:nth-child(24)'));
      report('successfully rendered new board.');
    })
    .then(function() { 
      debugger
      var cell_element = browser.querySelector('#black .board .jgo_c:nth-child(24)');
      return browser.fire('click', cell_element);
    })
    .then(function() {
      assert.ok(browser.query('#black .board .jgo_c:nth-child(24).jgo_b'));
      report('successfully placed a stone.');
      var board_id = browser.location.pathname.match(/^\/boards\/([0-9]+)$/)[1];
      return board_id;
    })
    .then(function(board_id) {
      return browser.visit("/boards/" + board_id);
    })
    .then(function(){
      assert.ok(browser.query('#black .board .jgo_c:nth-child(24).jgo_b'));
      report('successfully saved and reloaded the board intact');
    });
};

run_suite();

