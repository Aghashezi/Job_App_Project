# Job Application Project

This is a full-stack job listing web application with a Flask backend API and React frontend. The backend supports CRUD operations for job listings and integrates with a PostgreSQL database using SQLAlchemy. The frontend provides a modern, responsive interface for browsing and managing job listings.

## 📹 Video Presentation
**Watch the project demonstration:** [Loom Video Presentation](https://www.loom.com/share/166c7c1d54004aec83103a06b6c0fbb6)

## 🚀 Quick Start

### Prerequisites
- **Python 3.7+** (Tested with Python 3.11)
- **Node.js 14+** (Tested with Node.js 18)
- **PostgreSQL 12+** (Tested with PostgreSQL 14)
- **Chrome browser** (for Selenium scraper functionality)

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aghashezi/Job_App_Project.git
   cd Job_App_Project
   ```

2. **Set up Python virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Install Node.js dependencies:**
   ```bash
   cd react-frontend
   npm install
   cd ..
   ```

## 🗄️ Database Configuration

### PostgreSQL Setup

1. **Install PostgreSQL:**
   - **Windows:** Download from [PostgreSQL official website](https://www.postgresql.org/download/windows/)
   - **macOS:** `brew install postgresql`
   - **Ubuntu:** `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service:**
   - **Windows:** PostgreSQL service should start automatically
   - **macOS:** `brew services start postgresql`
   - **Ubuntu:** `sudo systemctl start postgresql`

3. **Create database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE job_app_db;
   
   # Exit psql
   \q
   ```

4. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/job_app_db
   ```
   
   **Note:** Replace `your_password` with your PostgreSQL password. If you're using a different username, replace `postgres` as well.
   
   **Alternative:** Use the database setup script:
   ```bash
   python setup_database.py
   ```
   This script will help you create the `.env` file and set up the database automatically.

## 🏃‍♂️ Running the Application

### Backend (Flask API)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run the Flask application:**
   ```bash
   python app.py
   ```
   
   The API will be available at `http://localhost:5000`

### Frontend (React App)

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd react-frontend
   ```

2. **Start the React development server:**
   ```bash
   npm start
   ```
   
   The frontend will be available at `http://localhost:3000`

### Selenium Scraper

1. **Install ChromeDriver:**
   - Download from [ChromeDriver official site](https://chromedriver.chromium.org/)
   - Add to your system PATH
   - **Alternative:** Use `pip install webdriver-manager` (already in requirements.txt)

2. **Run the scraper:**
   ```bash
   cd backend
   python scraper.py
   ```

## 📁 Project Structure

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

## 🔧 API Endpoints

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

## 🗃️ Database Schema

The `Job` model includes the following fields:
- `id` (Primary Key)
- `title` (String)
- `company` (String)
- `location` (String)
- `posting_date` (Date)
- `job_type` (String)
- `tags` (String, comma-separated)

## 🎯 Features

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

### Scraper (Selenium)
- **Automated job scraping** from external sources
- **Chrome browser automation**
- **Data extraction and storage**

## 🛠️ Troubleshooting

### Common Issues

1. **PostgreSQL Connection Error:**
   - Ensure PostgreSQL is running
   - Check your `.env` file configuration
   - Verify database exists: `psql -U postgres -d job_app_db`

2. **Port Already in Use:**
   - Backend: Change port in `app.py` or kill process on port 5000
   - Frontend: Change port in `package.json` or kill process on port 3000

3. **ChromeDriver Issues:**
   - Update Chrome browser to latest version
   - Download matching ChromeDriver version
   - Add ChromeDriver to system PATH

4. **CORS Errors:**
   - Ensure backend is running on `http://localhost:5000`
   - Check that CORS is properly configured in `app.py`

### Development Commands

```bash
# Start both services (in separate terminals)
# Terminal 1 - Backend
cd backend && python app.py

# Terminal 2 - Frontend
cd react-frontend && npm start

# Run scraper
cd backend && python scraper.py

# Check database connection
psql -U postgres -d job_app_db -c "SELECT * FROM job;"
```

## 📚 Additional Resources

- **GitHub Repository:** https://github.com/Aghashezi/Job_App_Project
- **Video Presentation:** https://www.loom.com/share/166c7c1d54004aec83103a06b6c0fbb6
- **Flask Documentation:** https://flask.palletsprojects.com/
- **React Documentation:** https://reactjs.org/
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/

## 📝 Notes

- Ensure PostgreSQL is running and the database is created before starting the backend
- The frontend is configured to connect to the backend at `http://localhost:5000`
- CORS is enabled on the backend to allow frontend requests
- Environment variables should be properly configured for production deployment
- The scraper requires Chrome browser and appropriate ChromeDriver installation

## 🎓 Project Deliverables

✅ **Code Repository:** GitHub repository with complete source code  
✅ **README Documentation:** Comprehensive setup and running instructions  
✅ **Video Presentation:** Loom video demonstrating the application  
✅ **Environment Setup:** Clear Python and Node.js version requirements  
✅ **Database Configuration:** PostgreSQL setup and connection instructions  
✅ **Running Instructions:** Step-by-step guide for both backend and frontend  
✅ **Scraper Setup:** Selenium and ChromeDriver installation guide  

---

**Repository:** https://github.com/Aghashezi/Job_App_Project  
**Video:** https://www.loom.com/share/166c7c1d54004aec83103a06b6c0fbb6