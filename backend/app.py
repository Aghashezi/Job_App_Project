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
    title = db.Column(db.String(100))
    company = db.Column(db.String(100))
    location = db.Column(db.String(100))

# Initialize the database tables manually
with app.app_context():
    db.create_all()

@app.route("/", methods=["GET"])
def home():
    # Serve the frontend HTML file
    return render_template("index.html")

@app.route("/jobs", methods=["GET"])
def get_jobs():
    # Sorting and filtering
    sort_by = request.args.get('sort_by', 'id')  # Default sort by ID
    order = request.args.get('order', 'asc')  # Default order is ascending
    filter_by_company = request.args.get('company')
    filter_by_location = request.args.get('location')

    query = Job.query

    if filter_by_company:
        query = query.filter(Job.company.ilike(f"%{filter_by_company}%"))
    if filter_by_location:
        query = query.filter(Job.location.ilike(f"%{filter_by_location}%"))

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
        } for j in jobs
    ])

@app.route("/jobs", methods=["POST"])
def add_job():
    data = request.get_json()
    new_job = Job(
        title=data["title"],
        company=data["company"],
        location=data["location"],
    )
    db.session.add(new_job)
    db.session.commit()
    return jsonify({"message": "Job added"}), 201

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
