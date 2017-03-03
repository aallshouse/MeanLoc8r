
var mongoose = require('mongoose');
var loc = mongoose.model('location');

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.create = function(req, res){
  var locationid = req.params.locationid;
  if(!locationid){
    sendJsonResponse(res, 404, {"message": "Not found, locationid required"});
    return;
  }

  loc.findById(locationid)
    .select('reviews')
    .exec(
      function(err, location){
        if(err){
          sendJsonResponse(res, 400, err);
          return;
        }

        doAddReview(req, res, location);
      }
    )
};

var doAddReview = function (req, res, location){
  if(!location){
    sendJsonResponse(res, 400, {
      "message": "locationid not found"
    });
    return;
  }

  location.reviews.push({
    author: req.body.author,
    rating: req.body.rating,
    reviewText: req.body.reviewText
  });
  location.save(function(err, location){
    if(err){
      sendJsonResponse(res, 400, err);
      return;
    }

    updateAverageRating(location._id);
    var thisReview = location.reviews[location.reviews.length - 1];
    sendJsonResponse(res, 201, thisReview);
  });
};

var updateAverageRating = function(locationid){
  loc.findById(locationid)
    .select('rating reviews')
    .exec(
      function(err, location){
        if(!err){
          doSetAverageRating(location);
        }
      }
    )
};

var doSetAverageRating = function(location){
  var i, reviewCount, ratingAverage, ratingTotal;
  if(location.reviews && location.reviews.length > 0){
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for(i = 0; i < reviewCount; i++){
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function(err){
      if(err){
        console.log(err);
        return;
      }

      console.log("Average rating updated to", ratingAverage);
    })
  }
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