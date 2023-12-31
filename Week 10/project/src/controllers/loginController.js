const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  if(req.session.user) {
    req.flash('errors', 'You are already logged in')
    res.redirect('/')
  }
    res.render('login');
};

exports.register = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.register();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                return res.redirect('/login');
            });
            return;
        };
        req.flash('success', 'User created successfully');
        req.session.save(() => {
            return res.redirect('/login');
        });
        return;
    } catch (e) {
        console.log(e);
        res.render('404')
    };
};

exports.login = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.login();

        if(login.errors.length > 0) {
          req.flash('errors', login.errors);
          req.session.save(function() {
            return res.redirect('/login');
          });
          return;
        }

        req.flash('success', 'You have entered the system');
        req.session.user = login.user;
        req.session.save(function() {
          return res.redirect('/');
        });
      } catch(e) {
        console.log(e);
        return res.render('404');
      }
};

exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
}
