Zombie = require('zombie');
assert = require('assert');
console.log('Running acceptance tests.');

//TODO set root site path (site: "localhost:3000")
browser = new Zombie();
browser.on("error", function(error) {
  console.error(error);
})

function report(msg) {
  console.log(msg);
}

browser.visit("http://localhost:3000", function() {
  report("making sure the server is up.");
  assert.ok(browser.success);
});

//TODO un-nest these steps. (using promises?)
browser.visit("http://localhost:3000/boards", function() {
  report("starting a new game");
  browser.pressButton("start a new game", function() {
    assert.ok(browser.success);
    assert.ok(browser.redirected);

    assert.ok(browser.location.pathname.match(/^\/boards\/[a-f,0-9]{24}$/));
    var board_id = browser.text("body h1").match(/^Board: ([a-f,0-9]{24})$/)[1];

    //TODO view the board
    report("viewing the board");
    browser.visit("http://localhost:3000/boards/" + board_id).then(function() {
  
      browser.wait(5.0, function() {
        //FIXME this query finds an element when viewed in the browser,
        // why not here? Is it a timing issue?
        assert.ok(browser.query('#black .board .jgo_c:nth-child(24)'));

        //TODO modify board
        report("placing a piece on the board");
        browser.clickLink('#black .board .jgo_c:nth-child(24)', function() {
          //TODO assert that cell was played 
          assert.ok(browser.query('#black .board .jgo_c:nth-child(24).jgo_b'));

          report("game board saves");
          browser.visit("http://localhost:3000/boards/" + board_id, function() {
            //TODO assert that the cells were repopulated from the DB
            assert.ok(browser.query('#black .board .jgo_c:nth-child(24).jgo_b'));
          });
        });
      });
    });
  });
});

