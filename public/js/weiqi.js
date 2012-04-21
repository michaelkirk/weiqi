// In case we leave a console.*** in the code without native support
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c;})(window.console=window.console||{});

var _init = function (weiqi) {

	var socketClient = io.connect(null, {
		'port': '#socketIoPort#'
		, 'rememberTransport': true
		, 'transports': ['websocket', 'xhr-multipart', 'xhr-polling', 'htmlfile', 'flashsocket']
	});

  // a general app for the weiqi site
  weiqi.site = function(initCallback){

   this.socketClient = socketClient;

    // global '/' channel
    this.socketClient
      .of('/')
      .on('connect', function () {
        console.log('connected');
        if(typeof initFunc == 'function')
          // so we are connected, 
          // is there anything we want to do immediately?
          initCallback();
    });
    this.socketClient
      .of('/')
      .on('disconnect', function() {
        console.log('disconnected!!!!!')
    });
    this.socketClient
      .of('/')
      .on('error', function() {
        console.log('error!')
    });

    this.socketClient
      .of('/')
      .on('message', function(msg) {
        console.log("recvd. message: ", msg)
        setTimeout(function() {
        	socketClient.send('pong');
        }, 1000);
    });
  }
    // a simple game app
  weiqi.game = function(boardId){

    this.socketClient = socketClient;
    this.board = new wieqi.Board();
  }
  return weiqi;

}

// client side only
if(typeof exports === "undefined"){
  this['weiqi'] = this['weiqi'] || {};
  weiqi = _init(weiqi)
}

