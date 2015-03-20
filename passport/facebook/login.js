"use strict";

var FacebookStrategy = require('passport-facebook').Strategy;
var findOrCreateUser = require('../../utilities/findOrCreateUser');

module.exports = function (passport) {

	passport.use('login-facebook', new FacebookStrategy({
			clientID: clientID,
			clientSecret: 'clientSecret',
			callbackURL: "http://localhost:3000/auth/facebook/return"
		},
		function (accessToken, refreshToken, profile, done) {

			/* 
			//Keeping this as good example of closure:)
			var findOrCreateUser = function (email) {

				console.log(findOrCreateUser);
				console.log(this);


				// check in mongo if a user with email exists or not
				User.findOne({
						'email': email
					},
					function (err, user) {
						// In case of any error, return using the done method
						if (err) {
							return done(err);
						}
						// Username does not exist, Create a new one, Generate Random Password
						if (!user) {
							console.log('User Not Found with email ' + email + '. Creating a new one with a random password.');
							user = new User();

							// set the user's local credentials
							user.email = email;
							var unhassedpwd = createHash(Math.random().toString(36).substr(2, 8));
							console.log('Generated password: ' + unhassedpwd);
							user.password = createHash(unhassedpwd);
							user.displayname = profile.displayName;
							user.firstName = profile.name.givenName;
							user.lastName = profile.name.familyName;

							// save the user
							user.save(function (error) {
								if (error) {
									console.log('Error in Saving user: ' + error);
									throw error;
								}
								console.log('User Registration succesful');
								return done(null, user);
							});
						} else {

							// User exist return user from done method
							// which will be treated like success
							return done(null, user);
						}
					}
				);
			};


			// Delay the execution of findOrCreateUser and execute the method
			// in the next tick of the event loop

			var findOrCreateUserClosured = function () {
				return findOrCreateUser(profile.emails[0].value);
			};
			process.nextTick(findOrCreateUserClosured);
			*/

			console.log(profile);

			process.nextTick(findOrCreateUser.bind(null, 'email', {
				'email': profile.emails[0].value,
				'displayname': profile.displayName,
				'firstname': profile.name.givenName,
				'lastname': profile.name.familyName,
				'gender': profile.gender
			}, done));

		}));
};
