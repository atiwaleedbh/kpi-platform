const KPI = require('../models/KPI');
const Metric = require('../models/Metric');

// Get all KPIs
exports.getAllKPIs = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const kpis = await KPI.find(filter)
      .populate('category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: kpis.length,
      data: kpis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single KPI
exports.getKPIById = async (req, res) => {
  try {
    const kpi = await KPI.findById(req.params.id).populate('category');

    if (!kpi) {
      return res.status(404).json({
        success: false,
        error: 'KPI not found'
      });
    }

    res.json({
      success: true,
      data: kpi
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new KPI
exports.createKPI = async (req, res) => {
  try {
    const kpi = await KPI.create(req.body);
    await kpi.populate('category');

    res.status(201).json({
      success: true,
      data: kpi
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update KPI
exports.updateKPI = async (req, res) => {
  try {
    const kpi = await KPI.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category');

    if (!kpi) {
      return res.status(404).json({
        success: false,
        error: 'KPI not found'
      });
    }

    res.json({
      success: true,
      data: kpi
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete KPI
exports.deleteKPI = async (req, res) => {
  try {
    const kpi = await KPI.findByIdAndDelete(req.params.id);

    if (!kpi) {
      return res.status(404).json({
        success: false,
        error: 'KPI not found'
      });
    }

    // Delete all associated metrics
    await Metric.deleteMany({ kpi: req.params.id });

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

// Get KPI statistics
exports.getKPIStats = async (req, res) => {
  try {
    const kpi = await KPI.findById(req.params.id);

    if (!kpi) {
      return res.status(404).json({
        success: false,
        error: 'KPI not found'
      });
    }

    // Get latest metrics
    const metrics = await Metric.find({ kpi: req.params.id })
      .sort({ timestamp: -1 })
      .limit(30);

    // Calculate statistics
    const values = metrics.map(m => m.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length || 0;
    const min = Math.min(...values) || 0;
    const max = Math.max(...values) || 0;

    res.json({
      success: true,
      data: {
        kpi,
        statistics: {
          average: avg.toFixed(2),
          minimum: min,
          maximum: max,
          dataPoints: metrics.length
        },
        recentMetrics: metrics.slice(0, 10)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
