# Job Application Project - Backend

## Overview
This project is a backend application for managing job listings. It includes a Flask API that supports CRUD operations and integrates with a PostgreSQL or MySQL database using SQLAlchemy. Additionally, it features a Selenium bot that automatically scrapes job listings from "https://www.actuarylist.com/" and stores them in the database.

## Project Structure
```
job_app_project
├── backend
│   ├── scraper.py        # Selenium bot for scraping job listings
│   ├── app.py            # Flask application entry point
│   ├── models
│   │   └── job.py        # Job model definition
│   ├── config.py         # Configuration settings
│   ├── requirements.txt   # List of dependencies
│   └── README.md         # Documentation for the backend project
├── .env                  # Environment variables
└── README.md             # Project overview
```

## Setup Instructions

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd job_app_project/backend
   ```

2. **Create a Virtual Environment**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**
   ```
   pip install -r requirements.txt
   ```

4. **Configure the Database**
   - Update the database connection details in `config.py` to match your PostgreSQL or MySQL setup.

5. **Set Up Environment Variables**
   - Create a `.env` file in the root directory and add your database credentials and any other sensitive information.

6. **Run the Flask Application**
   ```
   python app.py
   ```

7. **Run the Scraper**
   - The scraper will run automatically at specified intervals. Ensure that the Selenium WebDriver is correctly set up.

## Usage
- **CRUD Operations:**
  - **GET /jobs**: Fetch all job listings.
  - **POST /jobs**: Add a new job listing.
  - **DELETE /jobs/<id>**: Delete a job listing by ID.

## Logging
- The scraper logs execution details to `scraper.log`. Check this file for any errors or information regarding the scraping process.

## Notes
- Ensure that you have the necessary permissions and comply with the terms of service of the website you are scraping.
- Modify the scraping logic in `scraper.py` as needed to accommodate changes in the website structure.