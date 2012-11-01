Zombie = require('zombie');
assert = require('assert');

//TODO set root site path (site: "localhost:3000")
browser = new Zombie();
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
    .visit("http://localhost:3000")
    .then(function() {
      assert.ok(browser.success);
    })
    .fail(function(){
      report("The server must be up in order to run the suite.");
    });
}

function test_boards( ){
  function board_id(browser){
    ret = browser.location.pathname.match(/^\/boards\/([0-9]+)\/black$/)[1];
    if(ret == undefined) { report("board_id was undefined") }
    return ret
  }
  function board_url(board_id){
    return "http://localhost:3000/boards/" + board_id + "/black";
  }

  return browser
    .visit("http://localhost:3000/boards")
    .then(function(){ 
      report("successfully loaded creation page");
      return browser.pressButton("start a new game"); 
    })
    .then(function(){
      assert.ok(browser.success);
      assert.ok(browser.redirected);
      assert.ok(browser.location.pathname.match(/^\/boards\/[0-9]+\/black$/));
      report('successfully redirected to new board.');
      
      return board_id(browser);
    })
    .then(function(board_id) { return browser.visit(board_url(board_id)); })
    .then(function() {
      assert.ok(browser.query('#app .board .jgo_c:nth-child(24)'));
      report('successfully rendered new board.');
    })
    .then(function() { 
      //FIXME crashes server, subsequent tests still pass - which is pretty dubious.
      var cell_element = browser.querySelector('#app .board .jgo_c:nth-child(24)');
      return browser.fire('click', cell_element);
    })
    .then(function() {
      assert.ok(browser.query('#app .board .jgo_c:nth-child(24).jgo_b'));
      report('successfully placed a stone.');
      return board_id(browser);
    })
    .then(function(board_id) {
      return browser.visit(board_url(board_id));
    })
    .then(function(){
      assert.ok(browser.query('#black .board .jgo_c:nth-child(24).jgo_b'));
      report('successfully saved and reloaded the board intact');
    });
};

run_suite();

