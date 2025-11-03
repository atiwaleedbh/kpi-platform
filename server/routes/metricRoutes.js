const express = require('express');
const router = express.Router();
const {
  getAllMetrics,
  getMetricById,
  createMetric,
  updateMetric,
  deleteMetric,
  getMetricsByKPI,
  bulkCreateMetrics
} = require('../controllers/metricController');

router.route('/')
  .get(getAllMetrics)
  .post(createMetric);

router.route('/bulk')
  .post(bulkCreateMetrics);

router.route('/kpi/:kpiId')
  .get(getMetricsByKPI);

router.route('/:id')
  .get(getMetricById)
  .put(updateMetric)
  .delete(deleteMetric);

module.exports = router;
