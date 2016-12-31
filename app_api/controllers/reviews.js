
var mongoose = require('mongoose');
var loc = mongoose.model('location');

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.create = function(req, res){
  sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.read = function(req, res){
  if(!req.params || !req.params.locationid || !req.params.reviewid){
    sendJsonResponse(res, 404, {"message": "Not found, locationid and reviewid are both required"});
    return;
  }
  
  loc.findById(req.params.locationid)
    .select('name reviews')
    .exec(function(err, location){
      if(!location){
        sendJsonResponse(res, 404, {"message": "locationid not found"});
        return;
      }

      if(err){
        sendJsonResponse(res, 404, err);
        return;
      }

      if(!location.reviews || location.reviews.length === 0){
        sendJsonResponse(res, 404, {"message": "No reviews found"});
        return;
      }

      //console.log('req.params.reviewid: ' + req.params.reviewid);
      var review = location.reviews.toObject().find(function(r){
        //console.log('r.id: ' + r.id);
        //console.log(r);
        return r.id == req.params.reviewid;
      });
      if(!review){
        sendJsonResponse(res, 404, {"message": "reviewid not found"});
        return;
      }

      var response = {
        location: {
          name: location.name,
          id: req.params.locationid
        },
        review: review
      };
      sendJsonResponse(res, 200, response);
    });
};

module.exports.readAll = function(req, res){
  if(!req.params || !req.params.locationid){
    sendJsonResponse(res, 404, {"message": "no locationid in request"});
    return;
  }
  
  loc.findById(req.params.locationid)
    .select('name reviews')
    .exec(function(err, location){
      if(!location){
        sendJsonResponse(res, 404, {"message": "locationid not found"});
        return;
      }

      if(err){
        sendJsonResponse(res, 404, err);
        return;
      }

      if(!location.reviews || location.reviews.length === 0){
        sendJsonResponse(res, 404, {"message": "No reviews found"});
        return;
      }

      var response = {
        location: {
          name: location.name,
          id: req.params.locationid
        },
        reviews: location.reviews
      };
      sendJsonResponse(res, 200, response);
    });
};

module.exports.update = function(req, res){
  sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.delete = function(req, res){
  sendJsonResponse(res, 200, {"status": "success"});
};