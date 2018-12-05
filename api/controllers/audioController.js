'use strict';

const Audio = require('../models/Audio');
const helpers = require('../helpers/helpers');
const constants = require('../helpers/constants');

function formatAudioToSend(audio){
	
	return {
		id: audio.id,
		title: audio.audio_title,
		artist: audio.audio_artist,
		selected: audio.audio_selected,
		url: audio.audio_url
	};
}

function insertAudio(params, res){
	Audio.query().
	insert(helpers.formatData(params, constants.audioFields)).
	then(helpers.sendId(res)).
	catch(() => helpers.sendError(res));
}

function updateAudio(params, res){
	Audio.query().
	where('audio_id', params.id).
	update(helpers.formatData(params, constants.audioFields)).
	then(() => res.status(200).send({id: parseInt(params.id)})).
	catch(() => helpers.sendError(res));
}

function manageAudioData(req, res){
	const operationOnAudio = (req.body.id)? updateAudio : insertAudio;
	operationOnAudio(req.body, res);
}

function getAudios(req, res){
	Audio.query().
	select().
	then(audios => res.status(200).send(audios.map(audio => formatAudioToSend(audio))));
}

module.exports = {
	getAudios: getAudios,
	manageAudio: manageAudioData
};