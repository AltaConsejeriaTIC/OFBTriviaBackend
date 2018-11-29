'use strict';

const Video = require('../models/Video');
const helpers = require('../helpers/helpers');
const constants = require('../helpers/constants');

function formatVideoToSend(video){
	
	return {
		id: video.id,
		title: video.video_title,
		url: video.video_url
	};
}

function insertVideo(params, res){
	Video.query().
	insert(helpers.formatData(params, constants.videoFields)).
	then(helpers.sendId(res)).
	catch(() => res.status(500).send(constants.errorMessage));
}

function updateVideo(params, res){
	Video.query().
	where('video_id', params.id).
	update(helpers.formatData(params, constants.videoFields)).
	then(() => res.status(200).send({id: params.id})).
	catch(() => res.status(500).send(constants.errorMessage));
}

function manageVideoData(req, res){
	const videoOperation = (req.body.id)? updateVideo : insertVideo;
	videoOperation(req.body, res);
}

function getVideos(req, res){
	Video.query().
	select().
	then(videos => res.status(200).send(videos.map(video => formatVideoToSend(video)))).
	catch(() => res.status(500).send(constants.errorMessage));
}

module.exports = {
	manageVideoData: manageVideoData,
	getVideos: getVideos
};