from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import Job
import time, logging, os
import schedule
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Debug: Print the database URL
print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")  # Debug

# Configure logging
logging.basicConfig(filename="scraper.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:newpassword@localhost:5432/job_app_db')  # PostgreSQL URL
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

def scrape_jobs():
    """Scrape job listings from the website and store them in the database."""
    logging.info("Starting job scraping...")
    driver = None
    try:
        # Initialize WebDriver
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")  # Run Chrome in headless mode
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Chrome(options=options)  # Ensure ChromeDriver is installed and in PATH
        driver.get("https://www.actuarylist.com/")

        # Wait for job postings to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "Job_job-card__YgDAV"))
        )

        # Find job postings
        jobs = driver.find_elements(By.CLASS_NAME, "Job_job-card__YgDAV")
        logging.info(f"Found {len(jobs)} job postings.")

        for job in jobs:
            try:
                # Extract job details
                title = job.find_element(By.CLASS_NAME, "Job_job-card__position__ic1rc").text
                company = job.find_element(By.CLASS_NAME, "Job_job-card__company__7T9qY").text
                location = job.find_element(By.CLASS_NAME, "Job_job-card__locations__x1exr").text if job.find_elements(By.CLASS_NAME, "Job_job-card__locations__x1exr") else "Not specified"

                logging.info(f"Scraped: {title}, {company}, {location}")

                # Check for duplicates in the database
                existing_job = session.query(Job).filter_by(title=title, company=company, location=location).first()
                if not existing_job:
                    # Add new job to the database
                    new_job = Job(title=title, company=company, location=location)
                    session.add(new_job)
                    session.commit()
                    logging.info(f"Added job: {title} at {company}")
                else:
                    logging.info(f"Skipped duplicate: {title} at {company}")
            except Exception as e:
                logging.error(f"Error processing job: {str(e)}")
    except Exception as e:
        logging.error(f"Error during scraping: {str(e)}")
    finally:
        if driver:
            driver.quit()
        logging.info("Scraping complete.")

if __name__ == "__main__":
    # Run the scraper once for testing
    scrape_jobs()

    # Schedule the scraper to run every 3 minutes for testing
    schedule.every(3).minutes.do(scrape_jobs)

    # For production, schedule at specific times
    schedule.every().day.at("00:00").do(scrape_jobs)
    schedule.every().day.at("03:00").do(scrape_jobs)
    schedule.every().day.at("06:00").do(scrape_jobs)

    # Keep the script running to execute scheduled tasks
    while True:
        schedule.run_pending()
        time.sleep(1)
