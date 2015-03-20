"use strict";

var GoogleStrategy = require('passport-google').Strategy;
var findOrCreateUser = require('../../utilities/findOrCreateUser');

module.exports = function (passport) {

	passport.use('login-google', new GoogleStrategy({
			returnURL: 'http://localhost:3000/auth/google/return',
			realm: 'http://localhost:3000/'
		},

		function (identifier, profile, done) {
			process.nextTick(findOrCreateUser.bind(null, 'email', {
				'email': profile.emails[0].value,
				'username': profile.displayName,
				'firstname': profile.name.givenName,
				'lastname': profile.name.familyName
			}, done));

		}
	));
};
