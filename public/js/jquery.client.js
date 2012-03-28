// In case we leave a console.*** in the code without native support
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info, log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c;})(window.console=window.console||{});

(function ($) {

	var socketIoClient = io.connect(null, {
		'port': '#socketIoPort#'
		, 'rememberTransport': true
		, 'transports': ['websocket', 'xhr-multipart', 'xhr-polling', 'htmlfile', 'flashsocket']
	});
	socketIoClient.on('connect', function () {
    console.log('connected')
	});

	socketIoClient.on('message', function(msg) {

    console.log("recvd. message: ", msg)
		setTimeout(function() {
		//	socketIoClient.send('pong');
		}, 1000);
	});

	socketIoClient.on('disconnect', function() {
    console.log('disconnected')
	});
})(jQuery);
