"use strict";
var bCrypt = require('bcryptjs');

var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
};

module.exports = {
	createHash: createHash,
	isValidPassword: isValidPassword
}