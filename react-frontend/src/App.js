import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddJob, setShowAddJob] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: ''
  });
  const [message, setMessage] = useState('');

  // Fetch jobs from the backend
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/jobs');
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

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/jobs', formData);
      setMessage('Job added successfully!');
      setFormData({ title: '', company: '', location: '' });
      fetchJobs(); // Refresh the job list
      setShowAddJob(false); // Hide the form after successful submission
    } catch (error) {
      setMessage('Error adding job. Please try again.');
      console.error('Error adding job:', error);
    }
  };

  // Delete a job
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/jobs/${id}`);
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
              <button 
                className="post-job-btn"
                onClick={(e) => { e.preventDefault(); setShowAddJob(!showAddJob); }}
              >
                Post A Job
              </button>
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
          {showAddJob ? (
            <div className="add-job-form">
              <div className="add-job-header">
                <h2 className="add-job-title">Add New Job</h2>
                <button
                  onClick={() => setShowAddJob(false)}
                  className="add-job-close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit}>
                <div className="add-job-form-grid">
                  <div className="add-job-form-group">
                    <label htmlFor="title" className="add-job-label">
                      Job Title <span>*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g., Senior Software Engineer"
                      className="add-job-input"
                      autoComplete="off"
                    />
                  </div>
                  
                  <div className="add-job-form-group">
                    <label htmlFor="company" className="add-job-label">
                      Company Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g., Tech Corp Inc."
                      className="add-job-input"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="add-job-form-group">
                  <label htmlFor="location" className="add-job-label">
                    Location <span>*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g., New York, NY or Remote"
                    className="add-job-input"
                    autoComplete="off"
                  />
                </div>

                <div className="add-job-buttons">
                  <button
                    type="submit"
                    className="add-job-submit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Add Job
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddJob(false)}
                    className="add-job-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {message && (
                <div className={`add-job-message ${message.includes('success') ? 'success' : 'error'}`}>
                  {message.includes('success') ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{message}</span>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;