const Metric = require('../models/Metric');
const KPI = require('../models/KPI');

// Get all metrics
exports.getAllMetrics = async (req, res) => {
  try {
    const { kpi, startDate, endDate, period } = req.query;
    const filter = {};

    if (kpi) filter.kpi = kpi;
    if (period) filter.period = period;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const metrics = await Metric.find(filter)
      .populate('kpi')
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      count: metrics.length,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single metric
exports.getMetricById = async (req, res) => {
  try {
    const metric = await Metric.findById(req.params.id).populate('kpi');

    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      });
    }

    res.json({
      success: true,
      data: metric
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new metric
exports.createMetric = async (req, res) => {
  try {
    // Verify KPI exists
    const kpi = await KPI.findById(req.body.kpi);
    if (!kpi) {
      return res.status(404).json({
        success: false,
        error: 'KPI not found'
      });
    }

    const metric = await Metric.create(req.body);
    await metric.populate('kpi');

    // Update KPI current value and previous value
    kpi.previousValue = kpi.currentValue;
    kpi.currentValue = metric.value;
    await kpi.save();

    res.status(201).json({
      success: true,
      data: metric
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update metric
exports.updateMetric = async (req, res) => {
  try {
    const metric = await Metric.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('kpi');

    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      });
    }

    res.json({
      success: true,
      data: metric
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete metric
exports.deleteMetric = async (req, res) => {
  try {
    const metric = await Metric.findByIdAndDelete(req.params.id);

    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get metrics by KPI
exports.getMetricsByKPI = async (req, res) => {
  try {
    const { limit = 50, period } = req.query;
    const filter = { kpi: req.params.kpiId };

    if (period) filter.period = period;

    const metrics = await Metric.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: metrics.length,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Bulk create metrics
exports.bulkCreateMetrics = async (req, res) => {
  try {
    const { metrics } = req.body;

    if (!Array.isArray(metrics) || metrics.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Metrics array is required'
      });
    }

    const createdMetrics = await Metric.insertMany(metrics);

    // Update KPIs
    const kpiUpdates = {};
    for (const metric of createdMetrics) {
      if (!kpiUpdates[metric.kpi]) {
        kpiUpdates[metric.kpi] = [];
      }
      kpiUpdates[metric.kpi].push(metric.value);
    }

    for (const [kpiId, values] of Object.entries(kpiUpdates)) {
      const kpi = await KPI.findById(kpiId);
      if (kpi) {
        kpi.previousValue = kpi.currentValue;
        kpi.currentValue = values[values.length - 1];
        await kpi.save();
      }
    }

    res.status(201).json({
      success: true,
      count: createdMetrics.length,
      data: createdMetrics
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
