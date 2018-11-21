'use strict';

const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const helpers = require('../helpers/helpers');

function validateCryptedPassword(plainText, password, res){
	bcrypt.compare(plainText, password, function(err, compareResult) {
		
		if(compareResult)
			res.status(200).send({message: "wrong password"});
		
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

function registerAdmin(req, res){
	Admin.query().
  insert(helpers.formatAdminData(req.body)).
  then(admin => {
    console.log(admin);
    if(admin)
      res.status(201).send({message: "Admin created."});
    
    else
      res.status(500).send({message: "Error on creating admin"});
  }).
  catch(e => console.log(e));
}

module.exports = {
	login: validateLoginCredentials,
  registerAdmin: registerAdmin
};