exports.list = function(req, res){
  res.render('boards/stub', {
            action: 'list'
  });
}
exports.load = function(req, res){
  res.render('boards/stub', {
            action: 'load'
  });
}
exports.view = function(req, res){
  res.render('boards/stub', {
            action: 'view'
  });
}
exports.edit = function(req, res){
  res.render('boards/stub', {
            action: 'edit'
  });
}
exports.update = function(req, res){
  res.render('boards/stub', {
            action: 'update'
  });
}
