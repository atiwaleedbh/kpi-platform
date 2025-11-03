import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { kpiAPI, categoryAPI } from '../services/api';

function KPIForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: 'number',
    customUnit: '',
    targetValue: '',
    targetType: 'maximize',
    frequency: 'daily',
    status: 'active',
    tags: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchKPI();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchKPI = async () => {
    try {
      setLoading(true);
      const response = await kpiAPI.getById(id);
      const kpi = response.data.data;
      setFormData({
        name: kpi.name,
        description: kpi.description || '',
        category: kpi.category?._id || '',
        unit: kpi.unit,
        customUnit: kpi.customUnit || '',
        targetValue: kpi.targetValue || '',
        targetType: kpi.targetType,
        frequency: kpi.frequency,
        status: kpi.status,
        tags: kpi.tags?.join(', ') || ''
      });
    } catch (err) {
      setError('Failed to load KPI');
      console.error(err);
    } finally {
      setLoading(false);
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
        ...formData,
        targetValue: formData.targetValue ? parseFloat(formData.targetValue) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
      };

      if (isEdit) {
        await kpiAPI.update(id, data);
      } else {
        await kpiAPI.create(data);
      }

      navigate('/kpis');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save KPI');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="loading">Loading KPI...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">{isEdit ? 'Edit KPI' : 'Create New KPI'}</h2>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Name *</label>
            <input
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              name="description"
              className="input"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Category *</label>
              <select
                name="category"
                className="input"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Status</label>
              <select
                name="status"
                className="input"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Unit *</label>
              <select
                name="unit"
                className="input"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="number">Number</option>
                <option value="percentage">Percentage</option>
                <option value="currency">Currency</option>
                <option value="time">Time</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {formData.unit === 'custom' && (
              <div className="form-group">
                <label className="label">Custom Unit</label>
                <input
                  type="text"
                  name="customUnit"
                  className="input"
                  value={formData.customUnit}
                  onChange={handleChange}
                  placeholder="e.g., requests, users"
                />
              </div>
            )}

            <div className="form-group">
              <label className="label">Frequency</label>
              <select
                name="frequency"
                className="input"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Target Value</label>
              <input
                type="number"
                name="targetValue"
                className="input"
                value={formData.targetValue}
                onChange={handleChange}
                step="any"
              />
            </div>

            <div className="form-group">
              <label className="label">Target Type</label>
              <select
                name="targetType"
                className="input"
                value={formData.targetType}
                onChange={handleChange}
              >
                <option value="maximize">Maximize</option>
                <option value="minimize">Minimize</option>
                <option value="maintain">Maintain</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              className="input"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., important, revenue, customer"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update KPI' : 'Create KPI')}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/kpis')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default KPIForm;
