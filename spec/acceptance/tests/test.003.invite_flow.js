// casper plays the role of white browser
casper.then(function(){
  casper.test.comment('It should have an invite flow')
  make_board(casper);
});

var black_url;
casper.then(function(){
  black_url = casper.evaluate(function(){
    return $('ul.share li a').attr('href');
  });
  // manipulate a black board
  var page = phantom_play_piece(24, black_url);
});

casper.waitUntilVisible(cell_selector(24, {color: 'black'}))

casper.then(function(){
  assert_piece_played(24, {casper:casper, color:'black'})
})

casper.run(function(){
  this.test.done();
});

