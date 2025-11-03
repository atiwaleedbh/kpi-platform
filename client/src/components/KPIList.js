import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { kpiAPI } from '../services/api';

function KPIList() {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ status: '' });

  useEffect(() => {
    fetchKPIs();
  }, [filter]);

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.status) params.status = filter.status;

      const response = await kpiAPI.getAll(params);
      setKpis(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load KPIs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this KPI?')) {
      return;
    }

    try {
      await kpiAPI.delete(id);
      fetchKPIs();
    } catch (err) {
      alert('Failed to delete KPI');
      console.error(err);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      case 'stable': return '→';
      default: return '';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      inactive: 'badge-warning',
      archived: 'badge-danger'
    };
    return `badge ${badges[status] || 'badge-info'}`;
  };

  if (loading) {
    return <div className="loading">Loading KPIs...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">KPIs</h2>
        <Link to="/kpis/new" className="btn btn-primary">
          + Add KPI
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card mb-20">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>Filter by status:</label>
          <select
            className="input"
            style={{ width: '200px' }}
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {kpis.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-title">No KPIs Found</div>
            <div className="empty-state-text">
              Get started by creating your first KPI
            </div>
            <Link to="/kpis/new" className="btn btn-primary">
              Create KPI
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {kpis.map((kpi) => (
            <div key={kpi._id} className="kpi-card">
              <div className="kpi-header">
                <div>
                  <div className="kpi-name">{kpi.name}</div>
                  <span className="kpi-category">
                    {kpi.category?.name || 'Uncategorized'}
                  </span>
                  <span className={getStatusBadge(kpi.status)} style={{ marginLeft: '8px' }}>
                    {kpi.status}
                  </span>
                </div>
                <span className={`stat-trend trend-${kpi.trend}`} style={{ fontSize: '24px' }}>
                  {getTrendIcon(kpi.trend)}
                </span>
              </div>

              {kpi.description && (
                <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>
                  {kpi.description}
                </p>
              )}

              <div style={{ marginBottom: '16px' }}>
                <div className="kpi-value">
                  {kpi.currentValue} {kpi.unit === 'custom' ? kpi.customUnit : kpi.unit}
                </div>
                {kpi.targetValue && (
                  <div className="kpi-target">
                    Target: {kpi.targetValue} ({kpi.targetType})
                  </div>
                )}
                {kpi.performance && (
                  <div className="kpi-target">
                    Performance: {kpi.performance}%
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to={`/kpis/${kpi._id}`} className="btn btn-primary" style={{ flex: 1 }}>
                  View
                </Link>
                <Link to={`/kpis/${kpi._id}/edit`} className="btn btn-secondary">
                  Edit
                </Link>
                <Link to={`/kpis/${kpi._id}/add-metric`} className="btn btn-secondary">
                  + Metric
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(kpi._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default KPIList;
