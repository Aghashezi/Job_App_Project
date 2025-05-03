# Job Application Project

This project is a backend application that supports CRUD operations for job listings and integrates with a PostgreSQL or MySQL database using SQLAlchemy. It also includes a Selenium bot for automated job scraping from "https://www.actuarylist.com/".

## Project Structure

```
job_app_project
├── backend
│   ├── scraper.py          # Selenium bot for scraping job listings
│   ├── app.py              # Main entry point for the Flask application
│   ├── models
│   │   └── job.py          # Job model definition
│   ├── config.py           # Configuration settings for the Flask app
│   ├── requirements.txt     # List of dependencies
│   └── README.md           # Documentation for the backend project
├── .env                    # Environment variables for sensitive information
└── README.md               # Documentation for the overall project
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd job_app_project
   ```

2. **Create a virtual environment:**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```
   pip install -r backend/requirements.txt
   ```

4. **Configure the database:**
   - Update the `.env` file with your database credentials.

5. **Run the Flask application:**
   ```
   cd backend
   python app.py
   ```

6. **Run the scraper:**
   - The scraper will run automatically at specified intervals as defined in `scraper.py`.

## Usage

- The application exposes a RESTful API for managing job listings:
  - `GET /jobs` - Fetch all job listings
  - `POST /jobs` - Add a new job listing
  - `DELETE /jobs/<id>` - Delete a job listing by ID

## Logging

- The scraper logs execution details to `scraper.log`.

## Notes

- Ensure that you have Chrome and the appropriate ChromeDriver installed for the Selenium bot to function correctly.
- Modify the scraping logic in `scraper.py` as needed to adapt to changes in the target website's structure.