casper.test.comment('test if the server is running');

casper.start(node_url, function(){
  this.test.assert(this.getCurrentUrl() == node_url);
  casper.test.comment(this.getCurrentUrl())
});


casper.run(function() {
  this.test.done(1); // I must be called once all the async stuff 
                     // has been executed. I'll also check that a
                     // single assertions has been performed.
});
