const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['number', 'percentage', 'currency', 'time', 'custom']
  },
  customUnit: {
    type: String,
    trim: true
  },
  targetValue: {
    type: Number
  },
  targetType: {
    type: String,
    enum: ['minimize', 'maximize', 'maintain'],
    default: 'maximize'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'daily'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  currentValue: {
    type: Number,
    default: 0
  },
  previousValue: {
    type: Number,
    default: 0
  },
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    default: 'stable'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate trend before saving
kpiSchema.pre('save', function(next) {
  this.updatedAt = Date.now();

  if (this.currentValue !== undefined && this.previousValue !== undefined) {
    if (this.currentValue > this.previousValue) {
      this.trend = 'up';
    } else if (this.currentValue < this.previousValue) {
      this.trend = 'down';
    } else {
      this.trend = 'stable';
    }
  }

  next();
});

// Virtual for performance percentage
kpiSchema.virtual('performance').get(function() {
  if (this.targetValue && this.currentValue !== undefined) {
    return ((this.currentValue / this.targetValue) * 100).toFixed(2);
  }
  return null;
});

kpiSchema.set('toJSON', { virtuals: true });
kpiSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('KPI', kpiSchema);
