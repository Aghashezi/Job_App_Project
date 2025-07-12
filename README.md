# Job Application Project

This is a full-stack job listing web application with a Flask backend API and React frontend. The backend supports CRUD operations for job listings and integrates with a PostgreSQL database using SQLAlchemy. The frontend provides a modern, responsive interface for browsing and managing job listings.

## Project Structure

```
Job_App_Project/
├── backend/
│   ├── app.py              # Main Flask application with REST API
│   ├── models/
│   │   └── job.py          # Job model definition with SQLAlchemy
│   ├── config.py           # Configuration settings
│   ├── requirements.txt     # Python dependencies
│   ├── scraper.py          # Selenium bot for scraping job listings
│   └── templates/
│       └── index.html      # HTML template
├── react-frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styles for the application
│   │   └── index.js        # React entry point
│   ├── package.json        # Node.js dependencies
│   └── public/
│       └── index.html      # HTML template for React app
├── .env                    # Environment variables (create this file)
└── README.md               # This file
```

## Features

### Backend (Flask API)
- **RESTful API** for job listings with full CRUD operations
- **PostgreSQL database** integration using SQLAlchemy ORM
- **Advanced filtering and search** capabilities
- **Pagination** support for large datasets
- **CORS enabled** for frontend integration
- **Environment-based configuration**

### Frontend (React)
- **Modern, responsive UI** with gradient design
- **Real-time search and filtering**
- **Add/Edit/Delete job listings**
- **Pagination controls**
- **Form validation**
- **Job type and location filters**

## Setup Instructions

### Prerequisites
- Python 3.7+
- Node.js 14+
- PostgreSQL database
- Chrome browser (for scraper functionality)

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Job_App_Project
   ```

2. **Create a virtual environment:**
   ```bash
   py -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/job_app_db
   ```

5. **Run the Flask application:**
   ```bash
   cd backend
   py app.py
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   cd react-frontend
   npm install
   ```

2. **Start the React development server:**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

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

## Development

### Running Both Services
1. Start the backend: `cd backend && py app.py`
2. Start the frontend: `cd react-frontend && npm start`
3. Access the application at `http://localhost:3000`

### Scraper Functionality
The project includes a Selenium-based scraper (`backend/scraper.py`) for automated job listing collection from external sources.

## Notes

- Ensure PostgreSQL is running and the database is created before starting the backend
- The frontend is configured to connect to the backend at `http://localhost:5000`
- CORS is enabled on the backend to allow frontend requests
- Environment variables should be properly configured for production deployment