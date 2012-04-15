// Fake user database
var users = [
    { name: 'sam', email: 'sam.vevang@gmail.com' }
  , { name: 'mike', email: 'michael.john.kirk@gmail.com' }
];

module.exports = function(app){
  
  users = {};

  users.list = function(req, res){
    res.render('users', { title: 'Users', users: users });
  };

  users.load = function(req, res, next){
    var id = req.params.id;
    req.user = users[id];
    if (req.user) {
      next();
    } else {
      next(new Error('cannot find user ' + id));
    }
  };

  users.view = function(req, res){
    res.render('users/view', {
        title: 'Viewing user ' + req.user.name
      , user: req.user
    });
  };

  users.edit = function(req, res){
    res.render('users/edit', {
        title: 'Editing user ' + req.user.name
      , user: req.user
    });
  };

  users.update = function(req, res){
    // Normally you would handle all kinds of
    // validation and save back to the db
    var user = req.body.user;
    req.user.name = user.name;
    req.user.email = user.email;
    res.redirect('back');
  };

  return users;
};
