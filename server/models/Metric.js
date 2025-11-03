const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  kpi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KPI',
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    required: true
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
metricSchema.index({ kpi: 1, timestamp: -1 });
metricSchema.index({ periodStart: 1, periodEnd: 1 });

module.exports = mongoose.model('Metric', metricSchema);
