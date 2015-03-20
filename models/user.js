"use strict";
var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	email: String,
	password: String,
	displayname: String,
	firstname: String,
	lastname: String,
	gender: String,
});
