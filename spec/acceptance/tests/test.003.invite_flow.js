casper.then(function(){
  casper.test.comment('It should have an invite flow')
  make_board(casper);
});

casper.then(function(){
  var black_url = null;
  black_url = casper.evaluate(function(){
    return $('ul.share li a').attr('href')
  });
  casper.open(opponent_url)
});


casper.run(function(){
  this.test.done()

});

