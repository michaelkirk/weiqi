module.exports = function(app){

  index = {};

  index.index = function(req, res) {
    // Set example session uid for use with socket.io.
    // TODO move this to some middleware I think
    res.locals({
      'key': 'value'
    });
    res.render('index');
  };

  return index;

};
