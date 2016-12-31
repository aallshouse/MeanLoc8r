
var mongoose = require('mongoose');
var loc = mongoose.model('location');

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.listByDistance = function(req, res){
  loc.find()
    .exec(function(err, locations){
      if(!locations || locations.length === 0){
        sendJsonResponse(res, 404, {"message": "no locations found"});
        return;
      }

      if(err){
        sendJsonResponse(res, 404, err);
        return;
      }

      sendJsonResponse(res, 200, locations);
    });
};

module.exports.create = function(req, res){
  sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.read = function(req, res){
  if(!req.params || !req.params.locationid){
    sendJsonResponse(res, 404, {"message": "no locationid in request"});
    return;
  }
  
  loc.findById(req.params.locationid)
    .exec(function(err, location){
      if(!location){
        sendJsonResponse(res, 404, {"message": "locationid not found"});
        return;
      }

      if(err){
        sendJsonResponse(res, 404, err);
        return;
      }

      sendJsonResponse(res, 200, location);
    });
};

module.exports.update = function(req, res){
  sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.delete = function(req, res){
  sendJsonResponse(res, 200, {"status": "success"});
};