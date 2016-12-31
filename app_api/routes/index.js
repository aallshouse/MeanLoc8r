var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');

//locations
router.get('/locations', ctrlLocations.listByDistance);
router.post('/locations', ctrlLocations.create);
router.get('/locations/:locationid', ctrlLocations.read);
router.put('/locations/:locationid', ctrlLocations.update);
router.delete('/locations/:locationid', ctrlLocations.delete);

//reviews
router.post('/locations/:locationid/reviews', ctrlReviews.create);
router.get('/locations/:locationid/reviews', ctrlReviews.readAll);
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.read);
router.put('/locations/:locationid/reviews/:reviewid', ctrlReviews.update);
router.delete('/locations/:locationid/reviews/:reviewid', ctrlReviews.delete);

module.exports = router;