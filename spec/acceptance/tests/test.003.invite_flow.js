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

casper.waitUntilVisible('#app .board .jgo_c:nth-child(24).jgo_b')

casper.then(function(){
  assert_piece_played(24, {casper:casper, color:'black'})
})

casper.run(function(){
  this.test.done();
});

