node_url = 'http://localhost:3000/';

casper.start(node_url);

// record a reference to the number of asserts
var make_board_asserts = 2;
function make_board(casper){

  casper.thenOpen(node_url + 'boards', function(){
    this.test.assert(this.getCurrentUrl() == node_url + 'boards');
    this.click('[value="start a game"]')
  });

  casper.then(function(){
    this.test.assertUrlMatch(new RegExp("^"+node_url+"boards/[a-f0-9-]+/white"))
  });

  return casper;

};

function board_regex(casper){
  console.log(casper.getCurrentUrl())
  return casper.getCurrentUrl().match(new RegExp("^"+node_url+"boards/([a-f0-9-]+)/(black|white)"));
};

function board_id(casper){
  return board_regex(casper)[1];
};

function board_color(casper){
  return board_regex(casper)[2];
};

function board_url(board_id, options){
  var options = options || {};
  var color = options['color'] || "black";
  return node_url + "boards/" + board_id + "/" + color;
};

function play_piece(index, casper) {
  casper.then(function(){
    casper.test.comment('trying to place a stone on ' + board_id(casper));
    casper.click('#app .board .jgo_c:nth-child(' + index + ')');
  });
  casper.waitForSelector('#app .board .jgo_c:nth-child(' + index + ').' + class_for_color(board_color(casper)));
};

function class_for_color(color) {
  if (color == "white") {
    return "jgo_w";
  } else if (color == "black") {
    return "jgo_b";
  } else {
    throw Error("unknown color: " + color);
  };
};

function cell_selector(index, options){
  var sel = '#app .board .jgo_c:nth-child(' + index + ')'
  // select the cell with a specific color stone?
  if(options && options.color)
    return sel + '.' + class_for_color(options.color);
  return sel;
};

function assert_piece_played(index, options) {
  options = options || {};

  var casper = options['casper'] || casper;
  var selector_string = cell_selector(index, options);

  casper.test.comment('searching for stone at ' + selector_string);
  casper.test.assertExists(selector_string, "Discovered stone at cell "+ index);
  casper.test.comment('stone found.');
}

/*
 * Phantom JS API
 */
function phantom_play_piece(index, url, page){
  var player_page = page || require('webpage').create();
  var full_url = node_url + url.slice(1) // remove the leading slash
  casper.test.comment('Trying to open ' + full_url)
  player_page.open(full_url, function (status) {
      if (status !== 'success') {
          console.log('Unable to access network');
      } else {
          var clicked_cell = player_page.evaluate(function (index) {
              return $('#app .board .jgo_c:nth-child('+index+')').click();
          }, index); // send the index in as a parameter here since closures do not cross page threshholds
      }
  });
};
