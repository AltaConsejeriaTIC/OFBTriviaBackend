'use strict';

const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const helpers = require('../helpers/helpers');

function validateCryptedPassword(plainText, password, AdminId, res){
	bcrypt.compare(plainText, password, function(err, compareResult) {
    helpers.runFunctionByCondition(compareResult, res.status(200).send, [{id: AdminId}],
                                   res.status(401).send, [{message: "wrong password"}]);
  });
}

function validateLoginCredentials(req, res){
	Admin.query().
	select('admin_password as  password', 'admin_is_active as isActive').
	where('admin_account_name', req.body.userName).
	andWhere('admin_is_active', true).
	then(accountInfo =>
		helpers.runFunctionByCondition(Boolean(accountInfo[0]), validateCryptedPassword,
                                   [req.body.password, accountInfo[0].password,
                                    accountInfo.id, res], res.status(401).send,
                                   [{message: "wrong or deactivated account user"}]));
}

function registerAdmin(req, res){
	Admin.query().
  insert(helpers.formatAdminData(req.body)).
  then(admin =>
    helpers.runFunctionByCondition(Boolean(admin), res.status(201).send,
                                   [{message: "Admin created."}], res.status(500).send,
                                   [{message: "Error on creating admin"}])).
  catch(e => console.log(e));
}

module.exports = {
	login: validateLoginCredentials,
  registerAdmin: registerAdmin
};