node_url = 'http://localhost:3000/'

var casper = require('casper').create({
      verbose: true,
        logLevel: "debug"
});

casper.start(node_url, function(){
  this.test.assert(this.getCurrentUrl() == node_url);
  console.log(this.getCurrentUrl())
});


casper.run(function() {
});
