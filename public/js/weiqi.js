// In case we leave a console.*** in the code without native support
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c;})(window.console=window.console||{});

var _init = function (weiqi) {

  // a general app for the weiqi site
  weiqi.site = function(initCallback){

  this.socketClient = io.connect('http://localhost::#socketIoPort#//weiqi');

   this.socketClient
      .of('/weiqi')
      .on('connecting', function () {
        console.log('connecting to /weiqi')
      })
      .on('connect', function () {
         console.log('connected to /weiqi');
         if(typeof initCallback == 'function')
           // so we are connected, 
           // is there anything we want to do immediately?
           initCallback();
      })
      .on('connect_failed', function () {console.log('connection failed')})
      .on('disconnect', function() {
          console.log('client of:"/weiqi" - disconnected')
      })
      .on('error', function(e) {
          console.log('client of:"/weiqi" - error', e)
      })
      .on('anything', function(data, callback) {
        console.log('anything', data, callback)
      })
      .on('news', function(msg, callback) {
        console.log("recvd. message: ", msg)
        setTimeout(function() {
          console.log('sending pong');
          callback('pong');
        }, 1000);
      });
  }

  // a simple game app
  weiqi.game = function(boardId){
    this.socketClient = socketClient;
    this.board = new wieqi.Board();
  }

  // a test rig to experiment with socket.io
  weiqi.chat = function(path){
    this.path = path;
    this.board = new wieqi.Board();
  }
  return weiqi;

}

// client side only
if(typeof exports === "undefined"){
  this['weiqi'] = this['weiqi'] || {};
  weiqi = _init(weiqi)
}

