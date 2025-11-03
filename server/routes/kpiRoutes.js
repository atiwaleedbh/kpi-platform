const express = require('express');
const router = express.Router();
const {
  getAllKPIs,
  getKPIById,
  createKPI,
  updateKPI,
  deleteKPI,
  getKPIStats
} = require('../controllers/kpiController');

router.route('/')
  .get(getAllKPIs)
  .post(createKPI);

router.route('/:id')
  .get(getKPIById)
  .put(updateKPI)
  .delete(deleteKPI);

router.route('/:id/stats')
  .get(getKPIStats);

module.exports = router;
