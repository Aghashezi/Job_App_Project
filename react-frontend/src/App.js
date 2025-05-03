import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch jobs from the backend
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/jobs');
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete a job
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter((job) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      return aValue.localeCompare(bValue);
    });

  return (
    <div className="main-bg">
      {/* Header */}
      <header className="gradient-header">
        <div className="header-inner">
          <div className="logo-nav">
            <div className="logo">
              <span className="logo-icon">⫷⫸</span>
              <span className="logo-text">Actuary List</span>
            </div>
            <nav className="nav-links">
              <a href="#about">About</a>
              <a href="#blog">Blog</a>
              <a href="#post">Post A Job</a>
            </nav>
          </div>
          <div className="header-actions">
            <button className="alert-btn">Get Free Job Alerts</button>
          </div>
        </div>
        <div className="search-bar-row">
          <input
            type="text"
            className="main-search-input"
            placeholder="Enter Keyword or Job Title or Location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="main-search-btn">Search Jobs</button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="main-content-2col">
        {/* Sidebar Filters */}
        <aside className="sidebar-filters">
          {/* Country Filter */}
          <div className="filter-group">
            <div className="filter-title">Country</div>
            <div className="filter-list">
              <label><input type="checkbox" checked readOnly /> All countries <span className="filter-count">20</span></label>
              <label><input type="checkbox" readOnly /> USA <span className="filter-count">12</span></label>
              <label><input type="checkbox" readOnly /> UK <span className="filter-count">8</span></label>
            </div>
          </div>
          {/* City Filter */}
          <div className="filter-group">
            <div className="filter-title">City</div>
            <div className="filter-list">
              <label><input type="checkbox" checked readOnly /> All cities <span className="filter-count">20</span></label>
              <label><input type="checkbox" readOnly /> London <span className="filter-count">5</span></label>
              <label><input type="checkbox" readOnly /> Remote <span className="filter-count">3</span></label>
            </div>
          </div>
          {/* Experience Filter */}
          <div className="filter-group">
            <div className="filter-title">Experience</div>
            <div className="filter-list">
              <label><input type="checkbox" checked readOnly /> All levels <span className="filter-count">20</span></label>
              <label><input type="checkbox" readOnly /> Intern <span className="filter-count">2</span></label>
              <label><input type="checkbox" readOnly /> Analyst <span className="filter-count">6</span></label>
            </div>
          </div>
        </aside>

        {/* Job Listings */}
        <main className="job-listings-col">
          <div className="sort-row">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="title">Sort by Title</option>
              <option value="company">Sort by Company</option>
              <option value="location">Sort by Location</option>
            </select>
          </div>
          {isLoading ? (
            <div className="loading">Loading jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="no-jobs">
              {searchTerm ? (
                `No jobs found matching "${searchTerm}"`
              ) : (
                'No jobs found'
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="job-card-ui">
                <div className="job-card-header">
                  <div className="job-logo-placeholder">{job.company[0]}</div>
                  <div className="job-card-title-group">
                    <div className="job-title-ui">{job.title}</div>
                    <div className="job-company-ui">{job.company}</div>
                  </div>
                  <div className="job-badges-ui">
                    <span className="badge-ui location-badge">{job.location}</span>
                    <span className="badge-ui new-badge">new</span>
                  </div>
                </div>
                <div className="job-card-footer">
                  <button className="delete-btn-ui" onClick={() => handleDelete(job.id)} title="Delete job">×</button>
                  <span className="job-time-ui">6h ago</span>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export default App;