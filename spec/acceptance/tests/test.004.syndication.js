var Webpage = require('webpage')


casper.then(function(){
  casper.test.comment('** It should syndicate updates to everyone watching')
  make_board(casper);
})

var black_url;
var black_page;
casper.then(function(){
  black_url = get_invite_url(casper)
  casper.test.comment('create a phantom page and play a piece');
  black_page = phantom_play_piece(24, black_url);
})

casper.waitUntilVisible(cell_selector(24, {color: 'black'}))

casper.then(function(){
  casper.test.comment('The move appears for the white player')
  assert_piece_played(24, {color: "black", casper: casper});
})

casper.then(function(){
  casper.test.comment('The move appears for the black player')
  var white_url = casper.getCurrentUrl()
  casper.test.comment('swap out the current page for the black page');
  this.page = black_page;
  casper.test.comment('confirm we are on the "black browser"');
  this.test.assert(casper.getCurrentUrl() !== white_url, 'Casper is running a different page')
  assert_piece_played(24, {color: "black", casper: casper});
})


var first_game_page = Webpage.create();
var second_game_page = Webpage.create(); 

casper.then(function(){
  casper.test.comment('** It should only syndicate to browsers watching the game');
  casper.test.comment('set up two games in two seperate browsers');
  casper.test.comment('first game page...');
  casper.page = first_game_page;
  make_board(casper);
});

casper.then(function(){
  casper.test.comment('now the second game page...');
  casper.page = second_game_page;
  make_board(casper);
});

var second_game_black_page;
casper.then(function(){

  // note that at this point, casper is running the `casper.page === second_game_page`
  casper.test.assert(casper.page === second_game_page, 'Casper is running the second game');

  black_url = get_invite_url(casper);
  casper.test.comment('play a piece on the second game using `phantom_play_piece`');
  second_game_black_page = phantom_play_piece(24, black_url);
});

casper.waitUntilVisible(cell_selector(24, {color: 'black'}));
// lets show that the black piece played on second_game
casper.then(function(){
  casper.test.assert(casper.page === second_game_page && board_color(casper) == "white", 'Casper is running the second game, white');
  assert_piece_played(24, {casper:casper, color:'black'});
});

// now confirm that the other game does not have that piece played
casper.then(function(){
  casper.page = first_game_page;
  casper.test.assert(casper.page === first_game_page && board_color(casper) == "white", 'Casper is running the first game, white');
  var not_there = casper.evaluate(function(selector){
    return $(selector).length == 0;
  },
  cell_selector(24, {color:"black"}));
  casper.test.assert(not_there, 'piece is not present in game one');

});

casper.run(function(){
  this.test.done();
});
