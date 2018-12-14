'use strict';

const Video = require('../models/Video');
const helpers = require('../helpers/helpers');
const constants = require('../helpers/constants');
const youtube = require('../../config/thirdParty').youtube;

function formatVideoToSend(video){
  
  return {
    id: video.video_id,
    title: video.video_title,
    channel: video.video_author,
    time: video.video_total_time,
    selected: Boolean(video.video_selected),
    url: video.video_url,
    active: Boolean(video.video_active),
    thumbnail: video.video_thumbnail || ''
  };
}

function updateVideo(video, res){
  Video.query().
  where('video_id', video.id).
  update(helpers.formatData(video, constants.videoFields)).
  then(() =>  res.status(200).send({id: parseInt(video.id)})).
  catch(() => helpers.sendError(res));
}

function insertVideo(params, res){
  Video.query().
  insert(helpers.formatData(params, constants.videoFields)).
  then(video => res.status(200).send({id: parseInt(video.id)})).
  catch(() => helpers.sendError(res));
}

function manageVideoData(req, res){
  const videoOperation = (req.body.id)? updateVideo : insertVideo;
  videoOperation(req.body, res);
}

function getVideos(req, res){
  Video.query().
  select().
  where('video_active', true).
  then(videos => res.status(200).send(videos.map(video => formatVideoToSend(video)))).
  catch(() => helpers.sendError(res));
}

function getVideo(req, res){
  Video.query().
  select().
  where('video_id', req.swagger.params.id.value).
  then(video => res.status(200).send(formatVideoToSend(video[0]))).
  catch(() => helpers.sendError(res));
}

function getVideoData(req, res){
    youtube.videos.list({
      id: youtube_parser(req.swagger.params.url.value),
      part: 'contentDetails, snippet'
    })
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch(() => helpers.sendError(res));
}

// Esta función extrae el ID de un video de youtube desde la URL: url soportadas:
// http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
// http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
// http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
// http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
// http://www.youtube.com/embed/0zM3nApSvMg?rel=0
// http://www.youtube.com/watch?v=0zM3nApSvMg
// http://youtu.be/0zM3nApSvMg
function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

module.exports = {
  manageVideoData: manageVideoData,
  getVideos: getVideos,
  getVideo: getVideo,
  getVideoData: getVideoData
};