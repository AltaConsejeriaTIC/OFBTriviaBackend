'use strict';

const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

function validateCryptedPassword(plainText, password, res){
	bcrypt.compare(plainText, password, function(err, compareResult) {
		
		if(compareResult)
			res.status(200).send('login successful');
		
		else
			res.status(401).send({message: "wrong password"});
	});
}

function validateLoginCredentials(req, res){
	Admin.query().
	select('admin_password as  password', 'admin_is_active as isActive').
	where('admin_account_name', req.body.userName).
	andWhere('admin_is_active', true).
	then(accountInfo => {
		
		if (accountInfo[0] )
			validateCryptedPassword(req.body.password, accountInfo[0].password, res);
		
		else
			res.status(401).send({message: "wrong or deactivated account user"});
	});
}

module.exports = {
	login: validateLoginCredentials
};