var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    // bcrypt = require('bcrypt');


// var verifyHandler = function (accessToken, refreshToken, profile, done) {
   
//     process.nextTick(function () {
//         User.findOne({uid: profile.id}).done(function (err, user) {
//             if (user) {
//                 return done(null, user);
//             } else {
//                 User.create({
// 	            token: accessToken,
//                     provider: profile.provider,
//                     uid: profile.id,
// 	            created: new Date().getTime(),
//                     name: {
// 			first: profile.name.givenName, 
// 			last: profile.name.familyName
// 			},
// 	            username: profile._json.username,
// 		    facebookLink: profile._json.link,
// 		    birthday: profile._json.birthday,
// 		    gender: profile.gender,
// 		    email: profile._json.email,
// 	            currentLocation: profile._json.location,
// 	            politicalViews: profile._json.political,
// 	            religion: profile._json.religion,
// 		    bio: profile._json.bio,
// 		    education: profile._json.education,
// 		    updated: profile._json.updated_time,
// 		    alerts: {
// 			email: true,
// 			mobile: false,
// 			features: true
// 			}
			
//                 }).done(function (err, user) {
//                         return done(err, user);
//                     });
//             }
//         });
//     });
// };

var verifyHandler = function(token, tokenSecret, profile, done) {
  process.nextTick(function() {

    User.findOne({uid: profile.id}, function(err, user) {
      if (user) {
        return done(null, user);
      } else {

        var data = {
          provider: profile.provider,
          uid: profile.id,
          name: profile.displayName,
        };

        if (profile.emails && profile.emails[0] && profile.emails[0].value) {
          data.email = profile.emails[0].value;
        }
        if (profile.name && profile.name.givenName) {
          data.firstname = profile.name.givenName;
        }
        if (profile.name && profile.name.familyName) {
          data.lastname = profile.name.familyName;
        }

        User.create(data, function(err, user) {
          return done(err, user);
        });
      }
    });
  });
};




passport.serializeUser(function (user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function (uid, done) {
    User.findOne({uid: uid}).done(function (err, user) {
        done(err, user)
    });
});


module.exports = {

    // Init custom express middleware
    express: {
        customMiddleware: function (app) {
	console.log('Express Middleware -- Start Facebook Passport Strategy');
            passport.use(new FacebookStrategy({
                clientID: "520405918140970",
       	        clientSecret: "d287710fe5a8bad74c5ad8f40afee85b",
        	callbackURL: "http://localhost:1337/auth/facebook/callback",
                },
                verifyHandler
            ));


    passport.use(new GoogleStrategy({
      clientID: '453747433234-gips4b7qnfe3bf9ug4sf9mr505j44r6b.apps.googleusercontent.com',
      clientSecret: 'Pg3WPu-w1uQTrEXzyB1gSclJ',
      callbackURL: 'http://localhost:1337/auth/google/callback'
    }, verifyHandler));


            app.use(passport.initialize());
            app.use(passport.session());
        }
    }

};
