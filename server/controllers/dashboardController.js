const KPI = require('../models/KPI');
const Metric = require('../models/Metric');
const Category = require('../models/Category');

// Get dashboard overview
exports.getDashboardOverview = async (req, res) => {
  try {
    // Get counts
    const totalKPIs = await KPI.countDocuments();
    const activeKPIs = await KPI.countDocuments({ status: 'active' });
    const totalCategories = await Category.countDocuments();
    const totalMetrics = await Metric.countDocuments();

    // Get KPIs by status
    const kpisByStatus = await KPI.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get KPIs by category
    const kpisByCategory = await KPI.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $group: {
          _id: '$category',
          name: { $first: '$categoryInfo.name' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent metrics (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMetrics = await Metric.countDocuments({
      timestamp: { $gte: sevenDaysAgo }
    });

    // Get top performing KPIs
    const topKPIs = await KPI.find({ status: 'active' })
      .populate('category')
      .sort({ currentValue: -1 })
      .limit(5);

    // Get KPIs needing attention (far from target)
    const kpisNeedingAttention = await KPI.find({
      status: 'active',
      targetValue: { $exists: true, $ne: null }
    }).populate('category');

    const needsAttention = kpisNeedingAttention
      .filter(kpi => {
        const performance = (kpi.currentValue / kpi.targetValue) * 100;
        return performance < 70; // Less than 70% of target
      })
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        overview: {
          totalKPIs,
          activeKPIs,
          totalCategories,
          totalMetrics,
          recentMetrics
        },
        kpisByStatus,
        kpisByCategory,
        topKPIs,
        needsAttention
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get trends data
exports.getTrends = async (req, res) => {
  try {
    const { period = 'daily', days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get metrics for the period
    const metrics = await Metric.find({
      timestamp: { $gte: startDate },
      period
    })
      .populate('kpi')
      .sort({ timestamp: 1 });

    // Group by KPI
    const trendsByKPI = {};
    metrics.forEach(metric => {
      const kpiId = metric.kpi._id.toString();
      if (!trendsByKPI[kpiId]) {
        trendsByKPI[kpiId] = {
          kpi: metric.kpi,
          data: []
        };
      }
      trendsByKPI[kpiId].data.push({
        timestamp: metric.timestamp,
        value: metric.value
      });
    });

    res.json({
      success: true,
      data: Object.values(trendsByKPI)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get performance summary
exports.getPerformanceSummary = async (req, res) => {
  try {
    const kpis = await KPI.find({ status: 'active' }).populate('category');

    const summary = kpis.map(kpi => {
      let performanceStatus = 'on-track';
      let performancePercent = 0;

      if (kpi.targetValue) {
        performancePercent = (kpi.currentValue / kpi.targetValue) * 100;

        if (kpi.targetType === 'maximize') {
          if (performancePercent >= 100) performanceStatus = 'excellent';
          else if (performancePercent >= 80) performanceStatus = 'on-track';
          else if (performancePercent >= 60) performanceStatus = 'at-risk';
          else performanceStatus = 'critical';
        } else if (kpi.targetType === 'minimize') {
          if (performancePercent <= 100) performanceStatus = 'excellent';
          else if (performancePercent <= 120) performanceStatus = 'on-track';
          else if (performancePercent <= 150) performanceStatus = 'at-risk';
          else performanceStatus = 'critical';
        }
      }

      return {
        kpi: {
          id: kpi._id,
          name: kpi.name,
          category: kpi.category,
          unit: kpi.unit
        },
        currentValue: kpi.currentValue,
        targetValue: kpi.targetValue,
        trend: kpi.trend,
        performancePercent: performancePercent.toFixed(2),
        performanceStatus
      };
    });

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
