
casper.then(function(){
  make_board(casper);
})

casper.then(function(){
  this.test.comment('it should render the current players color');
  var color_string = casper.evaluate(function(){
    return $('h1').text()
  })
  this.test.assert(color_string === "white");
})


casper.thenOpen(node_url + '/boards/bogus-id-that-doesn\'t-exist/back', function(){
  this.test.comment('it should 404 when accessing a bogus board');
  // run this.status(true) to get the status obj as a string
  this.test.assert(this.status().currentHTTPStatus === 404);
})

casper.then(function(){
  make_board(casper);
})

casper.then(function(){
  // wrap this in a then function because casper's state depends on the previous step
  casper.open(board_url(board_id(casper), {color: 'black'}));
});

casper.then(function(){
  this.test.comment('it should create a playable game');
  var curr_id = board_id(casper);
  casper.test.assertExists('#app .board .jgo_c:nth-child(24)', 'the cell exists');
});

// TODO, why is does this need to be wrapped in a .then block?
casper.then(function(){
  play_piece(24, casper); // indexed x*19 + y
});

casper.then(function(){
  assert_piece_played(24, {casper:casper, color:'black'});
});

casper.then(function(){
  casper.test.comment('It should save and reload the board intact');
  this.reload();
});

casper.then(function(){
  assert_piece_played(24, {casper:casper, color:'black'});
});


casper.run(function() {
  this.test.done((2 * make_board_asserts) + 2); // I must be called once all the async stuff 
                     // has been executed. I'll also check that a
                     // single assertions has been performed.
});
