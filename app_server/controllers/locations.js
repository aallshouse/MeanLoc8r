/* GET home page. */
module.exports.homelist = function(req, res, next) {
  res.render('locations-list', { title: 'Home' });
};

/* GET location info page. */
module.exports.locationInfo = function(req, res, next) {
  res.render('index', { title: 'Location info' });
};

/* GET home page. */
module.exports.addReview = function(req, res, next) {
  res.render('index', { title: 'Add review' });
};