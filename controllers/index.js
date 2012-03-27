// Routing
exports.index = function(req, res) {
  // Set example session uid for use with socket.io.
  // TODO move this to some middleware I think
  if (!req.session.uid) {
    req.session.uid = (0 | Math.random()*1000000);
  }
  res.locals({
    'key': 'value'
  });
  res.render('index');
};

