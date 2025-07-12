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
    location: '',
    posting_date: '',
    job_type: '',
    tags: '' // comma-separated string
  });
  const [message, setMessage] = useState('');
  const [editJobId, setEditJobId] = useState(null);
  // Filtering state
  const [filterJobType, setFilterJobType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  // Fetch jobs from the backend
  const fetchJobs = async (page = 1, search = searchTerm, jobType = filterJobType, location = filterLocation, tag = filterTag) => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(jobType && { job_type: jobType }),
        ...(location && { location }),
        ...(tag && { tag })
      };
      const res = await axios.get('http://localhost:5000/jobs', { params });
      setJobs(res.data.jobs);
      setCurrentPage(res.data.pagination.current_page);
      setTotalPages(res.data.pagination.total_pages);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage, searchTerm, filterJobType, filterLocation, filterTag);
    // eslint-disable-next-line
  }, [currentPage, searchTerm, filterJobType, filterLocation, filterTag]);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle edit button click
  const handleEdit = (job) => {
    setEditJobId(job.id);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      posting_date: job.posting_date,
      job_type: job.job_type,
      tags: job.tags ? job.tags.join(', ') : ''
    });
    setShowAddJob(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required.';
    if (!formData.company) newErrors.company = 'Company is required.';
    if (!formData.location) newErrors.location = 'Location is required.';
    if (!formData.posting_date) newErrors.posting_date = 'Posting date is required.';
    if (!formData.job_type) newErrors.job_type = 'Job type is required.';
    return newErrors;
  };

  // Handle form submission (add or edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      if (editJobId) {
        await axios.put(`http://localhost:5000/jobs/${editJobId}`, payload);
        setMessage('Job updated successfully!');
      } else {
        await axios.post('http://localhost:5000/jobs', payload);
        setMessage('Job added successfully!');
      }
      setFormData({ title: '', company: '', location: '', posting_date: '', job_type: '', tags: '' });
      setEditJobId(null);
      fetchJobs();
      setShowAddJob(false);
    } catch (error) {
      setMessage('Error saving job. Please try again.');
      console.error('Error saving job:', error);
    }
  };

  // Delete a job
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`http://localhost:5000/jobs/${id}`);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  // Filter and sort jobs
  const filteredJobs = jobs;

  // Reset edit state when closing form
  const handleCloseForm = () => {
    setShowAddJob(false);
    setEditJobId(null);
    setFormData({ title: '', company: '', location: '', posting_date: '', job_type: '', tags: '' });
    setErrors({}); // Clear errors when closing form
  };

  // Pagination controls
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button className="main-search-btn">Search Jobs</button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="main-content-2col">
        {/* Sidebar Filters - make functional */}
        <aside className="sidebar-filters">
          <div className="filter-group">
            <div className="filter-title">Job Type</div>
            <div className="filter-list">
              <label><input type="radio" name="jobType" checked={filterJobType === ''} onChange={() => { setFilterJobType(''); setCurrentPage(1); }} /> All</label>
              {[...new Set(jobs.map(j => j.job_type))].filter(Boolean).map((type, idx) => (
                <label key={idx}><input type="radio" name="jobType" checked={filterJobType === type} onChange={() => { setFilterJobType(type); setCurrentPage(1); }} /> {type}</label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-title">Location</div>
            <div className="filter-list">
              <label><input type="radio" name="location" checked={filterLocation === ''} onChange={() => { setFilterLocation(''); setCurrentPage(1); }} /> All</label>
              {[...new Set(jobs.map(j => j.location))].filter(Boolean).map((loc, idx) => (
                <label key={idx}><input type="radio" name="location" checked={filterLocation === loc} onChange={() => { setFilterLocation(loc); setCurrentPage(1); }} /> {loc}</label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-title">Tags</div>
            <div className="filter-list">
              <label><input type="radio" name="tag" checked={filterTag === ''} onChange={() => { setFilterTag(''); setCurrentPage(1); }} /> All</label>
              {[...new Set(jobs.flatMap(j => j.tags || []))].filter(Boolean).map((tag, idx) => (
                <label key={idx}><input type="radio" name="tag" checked={filterTag === tag} onChange={() => { setFilterTag(tag); setCurrentPage(1); }} /> {tag}</label>
              ))}
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
                  onClick={handleCloseForm}
                  className="add-job-close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Add Job Form - show per-field errors */}
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
                    {errors.title && <div className="add-job-error">{errors.title}</div>}
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
                    {errors.company && <div className="add-job-error">{errors.company}</div>}
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
                  {errors.location && <div className="add-job-error">{errors.location}</div>}
                </div>
                <div className="add-job-form-group">
                  <label htmlFor="posting_date" className="add-job-label">
                    Posting Date <span>*</span>
                  </label>
                  <input
                    type="date"
                    id="posting_date"
                    name="posting_date"
                    value={formData.posting_date}
                    onChange={handleFormChange}
                    required
                    className="add-job-input"
                  />
                  {errors.posting_date && <div className="add-job-error">{errors.posting_date}</div>}
                </div>
                <div className="add-job-form-group">
                  <label htmlFor="job_type" className="add-job-label">
                    Job Type <span>*</span>
                  </label>
                  <input
                    type="text"
                    id="job_type"
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g., Full-time, Part-time, Contract, Internship"
                    className="add-job-input"
                    autoComplete="off"
                  />
                  {errors.job_type && <div className="add-job-error">{errors.job_type}</div>}
                </div>
                <div className="add-job-form-group">
                  <label htmlFor="tags" className="add-job-label">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    placeholder="e.g., Life, Health, Pricing"
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
                    {editJobId ? 'Update Job' : 'Add Job'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
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
              {/* Sort by posting_date */}
              <div className="sort-row">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="title">Sort by Title</option>
                  <option value="company">Sort by Company</option>
                  <option value="location">Sort by Location</option>
                  <option value="posting_date">Sort by Date Posted (Newest)</option>
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
                <>
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="job-card-ui">
                      <div className="job-card-header">
                        <div className="job-logo-placeholder">{job.company[0]}</div>
                        <div className="job-card-title-group">
                          <div className="job-title-ui">{job.title}</div>
                          <div className="job-company-ui">{job.company}</div>
                          <div className="job-meta-ui">
                            <span className="badge-ui job-type-badge">{job.job_type}</span>
                            <span className="badge-ui posting-date-badge">{job.posting_date}</span>
                          </div>
                          <div className="job-tags-ui">
                            {job.tags && job.tags.map((tag, idx) => (
                              <span key={idx} className="badge-ui tag-badge">{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="job-badges-ui">
                          <span className="badge-ui location-badge">{job.location}</span>
                          <span className="badge-ui new-badge">new</span>
                        </div>
                      </div>
                      <div className="job-card-footer">
                        <button className="edit-btn-ui" onClick={() => handleEdit(job)} title="Edit job" aria-label="Edit job">
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 13.5V16H6.5L14.873 7.627a1 1 0 0 0 0-1.414l-2.086-2.086a1 1 0 0 0-1.414 0L4 12.086V13.5z" stroke="#6c63ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button className="delete-btn-ui" onClick={() => handleDelete(job.id)} title="Delete job" aria-label="Delete job">
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 8v6m4-6v6m4-10v2M4 6h12M5 6v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6" stroke="#ff4d4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <span className="job-time-ui">{job.posting_date}</span>
                      </div>
                    </div>
                  ))}
                  <div className="pagination-controls">
                    <button className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`pagination-btn${currentPage === i + 1 ? ' active' : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;