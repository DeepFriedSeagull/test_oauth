"use strict";
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');


module.exports = function (criteria, data, done) {
	// check in mongo if a user with email exists or not
	var objCreteria = {};
	objCreteria[criteria] = data[criteria];


	// Generates hash using bCrypt
	var createHash = function (password) {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};


	User.findOne({
			'email': data.email
		},
		function (err, user) {
			// In case of any error, return using the done method
			if (err) {
				console.log('Error while finding an element in the database.');
				return done(err);
			}
			// Username does not exist, Create a new one, Generate Random Password
			if (!user) {
				console.log('User Not Found with ' + criteria + '=' + data[criteria] + '. Creating a new one with a random password.');
				user = new User();

				// set the user's local credentials
				user.email = data.email;
				// Creating password
				var unhassedpwd = createHash(Math.random().toString(36).substr(2, 8));
				console.log('Generated password: ' + unhassedpwd);
				user.password = createHash(unhassedpwd);

				user.firstname = data.firstname || "undifined";
				user.lastname = data.lastname || "undifined";
				user.displayname = data.displayname || data.firstname + ' ' + data.lastname;
				user.gender = data.gender || "undifined";

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
