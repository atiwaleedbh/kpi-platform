import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getOverview();
      setOverview(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!overview) {
    return <div className="error">No data available</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <Link to="/kpis/new" className="btn btn-primary">
          + Add KPI
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total KPIs</div>
          <div className="stat-value">{overview.overview.totalKPIs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active KPIs</div>
          <div className="stat-value">{overview.overview.activeKPIs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Categories</div>
          <div className="stat-value">{overview.overview.totalCategories}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Metrics</div>
          <div className="stat-value">{overview.overview.totalMetrics}</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Top Performing KPIs</h3>
          {overview.topKPIs && overview.topKPIs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {overview.topKPIs.map(kpi => (
                <Link key={kpi._id} to={`/kpis/${kpi._id}`} style={{ textDecoration: 'none' }}>
                  <div className="kpi-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div className="kpi-name">{kpi.name}</div>
                        <span className="kpi-category">{kpi.category?.name}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="kpi-value">{kpi.currentValue}</div>
                        <div className="kpi-target">
                          Target: {kpi.targetValue || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No KPIs available</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>KPIs Needing Attention</h3>
          {overview.needsAttention && overview.needsAttention.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {overview.needsAttention.map(kpi => (
                <Link key={kpi._id} to={`/kpis/${kpi._id}`} style={{ textDecoration: 'none' }}>
                  <div className="kpi-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div className="kpi-name">{kpi.name}</div>
                        <span className="kpi-category">{kpi.category?.name}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="kpi-value" style={{ color: '#EF4444' }}>
                          {kpi.currentValue}
                        </div>
                        <div className="kpi-target">
                          Target: {kpi.targetValue || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>All KPIs are on track!</p>
            </div>
          )}
        </div>
      </div>

      {overview.kpisByCategory && overview.kpisByCategory.length > 0 && (
        <div className="card mt-20">
          <h3 style={{ marginBottom: '20px' }}>KPIs by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overview.kpisByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
