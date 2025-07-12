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
from datetime import datetime, date, timedelta

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Debug: Print the database URL
print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")  # Debug

# Configure logging
logging.basicConfig(filename="scraper.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL')  # PostgreSQL URL
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

def scrape_jobs(max_pages=3):
    """Scrape job listings from the website and store them in the database."""
    logging.info(f"Starting job scraping for up to {max_pages} pages...")
    driver = None
    total_jobs_found = 0
    try:
        # Initialize WebDriver
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")  # Run Chrome in headless mode
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Chrome(options=options)  # Ensure ChromeDriver is installed and in PATH

        for page in range(1, max_pages + 1):
            if page == 1:
                url = "https://www.actuarylist.com/"
            else:
                url = f"https://www.actuarylist.com/?page={page}"
            logging.info(f"Scraping page {page}: {url}")
            driver.get(url)
            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "Job_job-card__YgDAV"))
                )
            except Exception as e:
                logging.warning(f"No job cards found on page {page}, stopping pagination: {str(e)}")
                break
            jobs = driver.find_elements(By.CLASS_NAME, "Job_job-card__YgDAV")
            logging.info(f"Found {len(jobs)} job postings on page {page}.")
            if len(jobs) == 0:
                logging.info(f"No jobs found on page {page}, stopping pagination.")
                break
            total_jobs_found += len(jobs)
            for job in jobs:
                try:
                    title = job.find_element(By.CLASS_NAME, "Job_job-card__position__ic1rc").text
                    company = job.find_element(By.CLASS_NAME, "Job_job-card__company__7T9qY").text
                    location = job.find_element(By.CLASS_NAME, "Job_job-card__locations__x1exr").text if job.find_elements(By.CLASS_NAME, "Job_job-card__locations__x1exr") else "Not specified"
                    # Validation: skip jobs with missing required fields
                    if not title.strip() or not company.strip() or not location.strip() or location == "Not specified":
                        logging.warning(f"Skipping job with missing fields: title='{title}', company='{company}', location='{location}'")
                        continue
                    posting_date_str = job.find_element(By.CLASS_NAME, "Job_job-card__date__1gkQw").text if job.find_elements(By.CLASS_NAME, "Job_job-card__date__1gkQw") else None
                    posting_date = None
                    if posting_date_str:
                        if 'day' in posting_date_str:
                            days_ago = int(posting_date_str.split()[0])
                            posting_date = date.today() - timedelta(days=days_ago)
                        elif 'h' in posting_date_str:
                            posting_date = date.today()
                        else:
                            try:
                                posting_date = datetime.strptime(posting_date_str, "%Y-%m-%d").date()
                            except Exception:
                                posting_date = date.today()
                    else:
                        posting_date = date.today()
                    job_type = "Full-time"
                    if job.find_elements(By.CLASS_NAME, "Job_job-card__type__2v2kF"):
                        job_type = job.find_element(By.CLASS_NAME, "Job_job-card__type__2v2kF").text
                    tags = []
                    if job.find_elements(By.CLASS_NAME, "Job_job-card__tags__2Qd7F"):
                        tag_elements = job.find_elements(By.CLASS_NAME, "Job_job-card__tags__2Qd7F span")
                        tags = [t.text for t in tag_elements if t.text]
                    tags_str = ','.join(tags)
                    logging.info(f"Scraped: {title}, {company}, {location}, {posting_date}, {job_type}, {tags_str}")
                    existing_job = session.query(Job).filter_by(title=title, company=company, location=location).first()
                    if not existing_job:
                        new_job = Job(title=title, company=company, location=location, posting_date=posting_date, job_type=job_type, tags=tags_str)
                        session.add(new_job)
                        session.commit()
                        logging.info(f"Added job: {title} at {company}")
                    else:
                        logging.info(f"Skipped duplicate: {title} at {company}")
                except Exception as e:
                    logging.error(f"Error processing job: {str(e)}")
            time.sleep(1)
        logging.info(f"Scraping complete. Total jobs found: {total_jobs_found}")
    except Exception as e:
        logging.error(f"Error during scraping: {str(e)}")
    finally:
        if driver:
            driver.quit()
        logging.info("Scraping complete.")

if __name__ == "__main__":
    # Run the scraper once for testing with 10 pages
    scrape_jobs(max_pages=3)

    # Schedule the scraper to run every 3 minutes for testing
    schedule.every(3).minutes.do(scrape_jobs, max_pages=3)

    # For production, schedule at specific times
    schedule.every().day.at("00:00").do(scrape_jobs, max_pages=3)
    schedule.every().day.at("03:00").do(scrape_jobs, max_pages=3)
    schedule.every().day.at("06:00").do(scrape_jobs, max_pages=3)

    # Keep the script running to execute scheduled tasks
    while True:
        schedule.run_pending()
        time.sleep(1)
