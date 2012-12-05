// casper plays the role of white browser
casper.then(function(){
  casper.test.comment('It should have an invite flow')
  make_board(casper);
});

var black_url = null;
casper.then(function(){
  black_url = casper.evaluate(function(){
    return $('ul.share li a').attr('href')
  });

  // manipulate a black board
  // here we break out into the pure phantom.js API
  // TODO, wrap this in a function in inc.js, 
  var black_player_page = require('webpage').create();
  casper.test.comment('Trying to open ' + node_url + black_url)
  black_player_page.open(node_url + black_url.slice(1), function (status) {
      if (status !== 'success') {
          console.log('Unable to access network');
      } else {
          var clicked_cell = black_player_page.evaluate(function () {
              return $('#app .board .jgo_c:nth-child(24)').click();
          });
      }
  });
});

casper.waitFor(function(){
  // the white play sits around until there is an indication that a move is made.
  return this.evaluate(function(){
    return window.game.board.moves.length > 0;
  })
})

casper.then(function(){
  assert_piece_played(24, {casper:casper, color:'black'})
})

casper.run(function(){
  this.test.done();
});

