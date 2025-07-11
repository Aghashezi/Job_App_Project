from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__, template_folder="templates")  # Specify the templates folder
CORS(app)

# Use PostgreSQL connection string from .env
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:newpassword@localhost:5432/job_app_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    posting_date = db.Column(db.Date, nullable=False)
    job_type = db.Column(db.String(50), nullable=False)
    tags = db.Column(db.String(255), nullable=True)

# Initialize the database tables manually
with app.app_context():
    db.create_all()

@app.route("/", methods=["GET"])
def home():
    # Serve the frontend HTML file
    return render_template("index.html")

@app.route("/jobs", methods=["GET"])
def get_jobs():
    sort_by = request.args.get('sort_by', 'posting_date')
    order = request.args.get('order', 'desc')
    filter_by_company = request.args.get('company')
    filter_by_location = request.args.get('location')
    filter_by_job_type = request.args.get('job_type')
    filter_by_tag = request.args.get('tag')

    query = Job.query

    if filter_by_company:
        query = query.filter(Job.company.ilike(f"%{filter_by_company}%"))
    if filter_by_location:
        query = query.filter(Job.location.ilike(f"%{filter_by_location}%"))
    if filter_by_job_type:
        query = query.filter(Job.job_type.ilike(f"%{filter_by_job_type}%"))
    if filter_by_tag:
        query = query.filter(Job.tags.ilike(f"%{filter_by_tag}%"))

    if order == 'desc':
        query = query.order_by(db.desc(getattr(Job, sort_by)))
    else:
        query = query.order_by(getattr(Job, sort_by))

    jobs = query.all()
    return jsonify([
        {
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "posting_date": j.posting_date.isoformat(),
            "job_type": j.job_type,
            "tags": j.tags.split(',') if j.tags else []
        } for j in jobs
    ])

@app.route("/jobs", methods=["POST"])
def add_job():
    data = request.get_json()
    required_fields = ["title", "company", "location", "posting_date", "job_type"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required."}), 400
    try:
        posting_date = data["posting_date"]
        # Accept both date string and ISO format
        from datetime import datetime
        posting_date = datetime.fromisoformat(posting_date).date()
    except Exception:
        return jsonify({"error": "Invalid posting_date format. Use YYYY-MM-DD."}), 400
    new_job = Job(
        title=data["title"],
        company=data["company"],
        location=data["location"],
        posting_date=posting_date,
        job_type=data["job_type"],
        tags=','.join(data.get("tags", [])) if isinstance(data.get("tags"), list) else (data.get("tags") or None)
    )
    db.session.add(new_job)
    db.session.commit()
    return jsonify({"message": "Job added"}), 201

@app.route("/jobs/<int:id>", methods=["PUT", "PATCH"])
def update_job(id):
    data = request.get_json()
    job = Job.query.get(id)
    if not job:
        return jsonify({"error": "Job not found."}), 404
    for field in ["title", "company", "location", "posting_date", "job_type", "tags"]:
        if field in data:
            if field == "posting_date":
                try:
                    from datetime import datetime
                    setattr(job, field, datetime.fromisoformat(data[field]).date())
                except Exception:
                    return jsonify({"error": "Invalid posting_date format. Use YYYY-MM-DD."}), 400
            elif field == "tags":
                setattr(job, field, ','.join(data[field]) if isinstance(data[field], list) else data[field])
            else:
                setattr(job, field, data[field])
    db.session.commit()
    return jsonify({"message": "Job updated"})

@app.route("/jobs/<int:id>", methods=["DELETE"])
def delete_job(id):
    job = Job.query.get(id)
    if not job:
        return jsonify({"message": "Not found"}), 404
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Deleted"})

if __name__ == "__main__":
    app.run(debug=True)
