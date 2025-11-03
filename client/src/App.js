import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import KPIList from './components/KPIList';
import KPIForm from './components/KPIForm';
import KPIDetail from './components/KPIDetail';
import CategoryList from './components/CategoryList';
import MetricForm from './components/MetricForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-brand">
              <h1>KPI Platform</h1>
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/kpis" className="nav-link">KPIs</Link>
              <Link to="/categories" className="nav-link">Categories</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kpis" element={<KPIList />} />
            <Route path="/kpis/new" element={<KPIForm />} />
            <Route path="/kpis/:id" element={<KPIDetail />} />
            <Route path="/kpis/:id/edit" element={<KPIForm />} />
            <Route path="/kpis/:id/add-metric" element={<MetricForm />} />
            <Route path="/categories" element={<CategoryList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
