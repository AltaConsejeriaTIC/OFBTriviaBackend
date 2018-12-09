'use strict';

const Youtube = require('googleapis').google.youtube;
const youtube = Youtube({
   version: 'v3',
   auth: ''
});

module.exports = {
	youtube: youtube
};