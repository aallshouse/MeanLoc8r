
var mongoose = require('mongoose');
var loc = mongoose.model('location');

var theEarth = (function(){
  var earthRadius = 6371; //km
  var getDistanceFromRads = function(rads){
    return parseFloat(rads * earthRadius);
  };
  var getRadsFromDistance = function(distance){
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.listByDistance = function(req, res){
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);

  if(!lat || !lng || !maxDistance){
    sendJsonResponse(res, 404, {
      message: 'lng, lat, and maxDistance query parameters are required.'
    });
    return;
  }

  var point = {
    type: 'Point',
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(maxDistance),
    num: 10
  };

  loc.geoNear(point, geoOptions, function(err, results, stats){
    if(err){
      sendJsonResponse(res, 404, err);
      return;
    }
    
    var locations = [];
    results.forEach(function(doc){
      locations.push({
        distance: theEarth.getDistanceFromRads(doc.dis),
        name: doc.obj.name,
        address: doc.obj.address,
        rating: doc.obj.rating,
        facilities: doc.obj.facilities,
        _id: doc.obj._id
      });
    });
    sendJsonResponse(res, 200, locations);
  });
};

module.exports.create = function(req, res){
  loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2
    }]
  }, function(err, location){
    if(err){
      sendJsonResponse(res, 400, location);
    } else {
      sendJsonResponse(res, 201, location);
    }
  });
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
  if(!req.params.locationid){
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid is required"
    });
    return;
  }

  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec(
      function(err, location){
        if(!location){
          sendJsonResponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        }

        if(err){
          sendJsonResponse(res, 400, err);
          return;
        }

        location.name = req.body.name;
        location.address = req.body.address;
        location.facilities = req.body.facilities.split(",");
        location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
        location.openingTimes = [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1
        }, {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2
        }];
        locations.save(function(err, location){
          if(err){
            sendJsonResponse(res, 404, err);
          } else {
            sendJsonResponse(res, 200, location);
          }
        });
      }
    );
};

module.exports.delete = function(req, res){
  var locationid = req.params.locationid;
  if(!locationid){
    sendJsonResponse(res, 404, {
      "message": "No locationid"
    });
    return;
  }

  Loc
    .findByIdAndRemove(locationid)
    .exec(
      function(err, location){
        if(err){
          sendJsonResponse(res, 404, err);
          return;
        }

        sendJsonResponse(res, 204, null);
      }
    );
};