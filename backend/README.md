# Job Application Project - Backend

## Overview
This is the backend component of the Job Application Project. It provides a Flask REST API that supports CRUD operations for job listings and integrates with a PostgreSQL database using SQLAlchemy. The backend also includes a Selenium bot for automated job scraping functionality.

## Project Structure
```
backend/
├── app.py              # Main Flask application with REST API
├── models/
│   └── job.py          # Job model definition with SQLAlchemy
├── config.py           # Configuration settings
├── requirements.txt     # Python dependencies
├── scraper.py          # Selenium bot for scraping job listings
└── templates/
    └── index.html      # HTML template
```

## Features

- **RESTful API** with full CRUD operations for job listings
- **PostgreSQL database** integration using SQLAlchemy ORM
- **Advanced filtering and search** capabilities
- **Pagination** support for large datasets
- **CORS enabled** for frontend integration
- **Environment-based configuration**
- **Selenium-based scraper** for automated job collection

## Setup Instructions

### Prerequisites
- Python 3.7+
- PostgreSQL database
- Chrome browser (for scraper functionality)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the project root directory:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/job_app_db
   ```

5. **Run the Flask application:**
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000`

## API Endpoints

### Job Listings
- `GET /jobs` - Fetch all job listings with filtering and pagination
  - Query parameters: `search`, `location`, `job_type`, `tag`, `page`, `limit`, `sort_by`, `order`
- `POST /jobs` - Add a new job listing
- `PUT /jobs/<id>` - Update an existing job listing
- `DELETE /jobs/<id>` - Delete a job listing

### Example API Usage
```bash
# Get all jobs
curl http://localhost:5000/jobs

# Search for jobs
curl "http://localhost:5000/jobs?search=developer&location=remote"

# Add a new job
curl -X POST http://localhost:5000/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "company": "Tech Corp",
    "location": "San Francisco, CA",
    "posting_date": "2024-01-15",
    "job_type": "Full-time",
    "tags": ["Python", "React", "AWS"]
  }'
```

## Database Schema

The `Job` model includes the following fields:
- `id` (Primary Key)
- `title` (String)
- `company` (String)
- `location` (String)
- `posting_date` (Date)
- `job_type` (String)
- `tags` (String, comma-separated)

## Scraper Functionality

The project includes a Selenium-based scraper (`scraper.py`) for automated job listing collection from external sources. The scraper logs execution details to `scraper.log`.

## Development

### Running the Backend
```bash
cd backend
python app.py
```

### Database Setup
Ensure PostgreSQL is running and the database is created before starting the backend. The application will automatically create the necessary tables on startup.

## Notes

- Ensure PostgreSQL is running and the database is created before starting the backend
- CORS is enabled to allow frontend requests from `http://localhost:3000`
- Environment variables should be properly configured for production deployment
- The scraper requires Chrome browser and appropriate ChromeDriver installation