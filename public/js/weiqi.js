// In case we leave a console.*** in the code without native support
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c;})(window.console=window.console||{});

var _init = function (weiqi) {

  // a simple game app
  weiqi.game = function(board_json, player_color){
      this.board = new weiqi.Board(board_json);
      this.board_view = new weiqi.BoardView({model: this.board, el: $('#app'), player_color: player_color});

      this.socketClient = io.connect('http://::#socketIoPort#//weiqi');
      this.socketClient
        .of('/weiqi')
        .on('connecting', function () {
          console.log('connecting to /weiqi')
        })
      var board = this.board;
      this.socketClient.on('board-update', function (data) {
        board.fetch().done(function(){
          board.trigger('board-updated', board)
          console.log('boards-updated for move ' + board.moves.length + ', refreshing local board');
        })
      });

  }

  // a test rig to experiment with socket.io
  weiqi.chat = function(path){
    this.path = path;
    this.board = new weiqi.Board();
  }
  return weiqi;

}

// client side only
if(typeof exports === "undefined"){
  this['weiqi'] = this['weiqi'] || {};
  weiqi = _init(weiqi)
}

