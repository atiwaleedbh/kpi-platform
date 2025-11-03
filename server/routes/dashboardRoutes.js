const express = require('express');
const router = express.Router();
const {
  getDashboardOverview,
  getTrends,
  getPerformanceSummary
} = require('../controllers/dashboardController');

router.get('/overview', getDashboardOverview);
router.get('/trends', getTrends);
router.get('/performance', getPerformanceSummary);

module.exports = router;
