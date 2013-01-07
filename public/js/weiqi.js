// In case we leave a console.*** in the code without native support
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c;})(window.console=window.console||{});

var _init = function (weiqi) {

  // a simple game app
  weiqi.game = function(board_json, player_id, player_color){
      this.board = new weiqi.Board(board_json, {player_id: player_id });
      var board = this.board;
      this.board_view = new weiqi.BoardView({model: this.board, el: $('#app'), player_color: player_color});

      this.socketClient = io.connect('http://::#socketIoPort#//weiqi');

      this.socketClient.emit('join board', board.id);

      this.socketClient.on('board-update', function (move_data) {
        var event = document.createEvent("HTMLEvents");
        event.initEvent("board-update", true, true);
        dispatchEvent(event);
        if(!board.moves.is_same_as_last_move(new weiqi.Move(move_data)))
          board.play(move_data.color, move_data.x, move_data.y, true)
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

