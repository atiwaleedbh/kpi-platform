import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { kpiAPI, metricAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

function KPIDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState(null);
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKPIDetails();
    fetchMetrics();
  }, [id]);

  const fetchKPIDetails = async () => {
    try {
      setLoading(true);
      const [kpiResponse, statsResponse] = await Promise.all([
        kpiAPI.getById(id),
        kpiAPI.getStats(id)
      ]);
      setKpi(kpiResponse.data.data);
      setStats(statsResponse.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load KPI details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await metricAPI.getByKPI(id, { limit: 30 });
      setMetrics(response.data.data);
    } catch (err) {
      console.error('Failed to load metrics', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this KPI?')) {
      return;
    }

    try {
      await kpiAPI.delete(id);
      navigate('/kpis');
    } catch (err) {
      alert('Failed to delete KPI');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading KPI details...</div>;
  }

  if (error || !kpi) {
    return <div className="error">{error || 'KPI not found'}</div>;
  }

  const chartData = metrics
    .slice()
    .reverse()
    .map(metric => ({
      date: format(new Date(metric.timestamp), 'MMM dd'),
      value: metric.value
    }));

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">{kpi.name}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/kpis/${id}/add-metric`} className="btn btn-primary">
            + Add Metric
          </Link>
          <Link to={`/kpis/${id}/edit`} className="btn btn-secondary">
            Edit
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>KPI Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <strong>Category:</strong> {kpi.category?.name || 'N/A'}
            </div>
            {kpi.description && (
              <div>
                <strong>Description:</strong> {kpi.description}
              </div>
            )}
            <div>
              <strong>Unit:</strong> {kpi.unit === 'custom' ? kpi.customUnit : kpi.unit}
            </div>
            <div>
              <strong>Frequency:</strong> {kpi.frequency}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <span className={`badge badge-${kpi.status === 'active' ? 'success' : 'warning'}`}>
                {kpi.status}
              </span>
            </div>
            <div>
              <strong>Target Type:</strong> {kpi.targetType}
            </div>
            {kpi.tags && kpi.tags.length > 0 && (
              <div>
                <strong>Tags:</strong>{' '}
                {kpi.tags.map(tag => (
                  <span key={tag} className="badge badge-info" style={{ marginRight: '4px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Current Performance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
                Current Value
              </div>
              <div style={{ fontSize: '32px', fontWeight: '600' }}>
                {kpi.currentValue}
              </div>
            </div>
            {kpi.targetValue && (
              <>
                <div>
                  <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
                    Target Value
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '600' }}>
                    {kpi.targetValue}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
                    Performance
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '600' }}>
                    {kpi.performance}%
                  </div>
                </div>
              </>
            )}
            <div>
              <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
                Trend
              </div>
              <div className={`stat-trend trend-${kpi.trend}`} style={{ fontSize: '20px' }}>
                {kpi.trend === 'up' ? '↑ Up' : kpi.trend === 'down' ? '↓ Down' : '→ Stable'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats && (
        <div className="card mt-20">
          <h3 style={{ marginBottom: '16px' }}>Statistics</h3>
          <div className="grid grid-4">
            <div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Average</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>{stats.statistics.average}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Minimum</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>{stats.statistics.minimum}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Maximum</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>{stats.statistics.maximum}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Data Points</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>{stats.statistics.dataPoints}</div>
            </div>
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="card mt-20">
          <h3 style={{ marginBottom: '20px' }}>Trend Chart (Last 30 Metrics)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {metrics.length > 0 && (
        <div className="card mt-20">
          <h3 style={{ marginBottom: '20px' }}>Recent Metrics</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Value</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Period</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {metrics.slice(0, 10).map(metric => (
                  <tr key={metric._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '12px' }}>
                      {format(new Date(metric.timestamp), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td style={{ padding: '12px', fontWeight: '600' }}>{metric.value}</td>
                    <td style={{ padding: '12px' }}>{metric.period}</td>
                    <td style={{ padding: '12px' }}>{metric.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default KPIDetail;
