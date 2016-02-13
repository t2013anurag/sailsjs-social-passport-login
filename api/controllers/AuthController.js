/**
 * AuthController
 **/

var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;
    // bcrypt = require('bcrypt');

var AuthController = {

  index: function (req, res) {
	res.view();
  },
  logout: function(req, res) {
        req.logout();
        res.redirect('/');
  },
  'facebook': function (req, res, next) {
	 passport.authenticate('facebook', { scope: ['email']},
		function (err, user) {
			req.logIn(user, function (err) {
			if(err) {
				console.log(err);
				req.view('500');
				return;
			}
			res.redirect('/');
			return;
		});
	})(req, res, next);
  },
   'facebook/callback': function (req, res, next) {
	 passport.authenticate('facebook', 
		function (req, res) {
			res.redirect('/');
		})(req, res, next);
  },


  google: function(req, res) {
    passport.authenticate('google', { failureRedirect: '/login', scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },
'google/callback': function (req, res, next) {
	 passport.authenticate('google', 
		function (req, res) {
			res.redirect('/');
		})(req, res, next);
  },


};

module.exports = AuthController;


