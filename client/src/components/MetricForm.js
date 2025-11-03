import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { metricAPI, kpiAPI } from '../services/api';

function MetricForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [kpi, setKpi] = useState(null);
  const [formData, setFormData] = useState({
    value: '',
    period: 'daily',
    periodStart: '',
    periodEnd: '',
    notes: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKPI();
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      periodStart: today,
      periodEnd: today
    }));
  }, [id]);

  const fetchKPI = async () => {
    try {
      const response = await kpiAPI.getById(id);
      setKpi(response.data.data);
      setFormData(prev => ({
        ...prev,
        period: response.data.data.frequency
      }));
    } catch (err) {
      setError('Failed to load KPI');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        kpi: id,
        value: parseFloat(formData.value),
        period: formData.period,
        periodStart: new Date(formData.periodStart),
        periodEnd: new Date(formData.periodEnd),
        notes: formData.notes || undefined
      };

      await metricAPI.create(data);
      navigate(`/kpis/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add metric');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!kpi) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Add Metric to {kpi.name}</h2>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">
              Value * ({kpi.unit === 'custom' ? kpi.customUnit : kpi.unit})
            </label>
            <input
              type="number"
              name="value"
              className="input"
              value={formData.value}
              onChange={handleChange}
              step="any"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Period *</label>
            <select
              name="period"
              className="input"
              value={formData.period}
              onChange={handleChange}
              required
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Period Start *</label>
              <input
                type="date"
                name="periodStart"
                className="input"
                value={formData.periodStart}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Period End *</label>
              <input
                type="date"
                name="periodEnd"
                className="input"
                value={formData.periodEnd}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Notes</label>
            <textarea
              name="notes"
              className="input"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any relevant notes about this metric..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Metric'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/kpis/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MetricForm;
