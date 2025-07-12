# Job Application Project - React Frontend

This is the frontend component of the Job Application Project, built with React. It provides a modern, responsive interface for browsing and managing job listings with real-time search, filtering, and CRUD operations.

## Features

- **Modern UI Design** with gradient headers and responsive layout
- **Real-time Search** across job titles and companies
- **Advanced Filtering** by job type, location, and tags
- **CRUD Operations** - Add, edit, and delete job listings
- **Pagination** for handling large datasets
- **Form Validation** with error handling
- **Responsive Design** that works on desktop and mobile devices

## Project Structure

```
react-frontend/
├── src/
│   ├── App.js          # Main React component with all functionality
│   ├── App.css         # Styles for the application
│   └── index.js        # React entry point
├── public/
│   └── index.html      # HTML template for React app
└── package.json        # Node.js dependencies
```

## Setup Instructions

### Prerequisites
- Node.js 14+
- Backend API running at `http://localhost:5000`

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd react-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## Available Scripts

### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Features Overview

### Job Management
- **View Jobs**: Browse all job listings with pagination
- **Search Jobs**: Real-time search by title or company
- **Filter Jobs**: Filter by job type, location, or tags
- **Add Jobs**: Add new job listings with form validation
- **Edit Jobs**: Modify existing job listings
- **Delete Jobs**: Remove job listings with confirmation

### User Interface
- **Header**: Navigation with logo and "Post A Job" button
- **Search Bar**: Main search functionality
- **Sidebar Filters**: Job type, location, and tag filters
- **Job Cards**: Display job information in organized cards
- **Pagination**: Navigate through large datasets
- **Modal Forms**: Add/edit job forms with validation

## API Integration

The frontend connects to the Flask backend API at `http://localhost:5000` and uses the following endpoints:

- `GET /jobs` - Fetch job listings with filtering and pagination
- `POST /jobs` - Add new job listings
- `PUT /jobs/<id>` - Update existing job listings
- `DELETE /jobs/<id>` - Delete job listings

## Development

### Running the Frontend
```bash
cd react-frontend
npm start
```

### Backend Integration
Ensure the Flask backend is running at `http://localhost:5000` before starting the frontend.

### Environment Variables
The frontend is configured to connect to the backend at `http://localhost:5000`. For production, update the API URLs in `App.js`.

## Notes

- The frontend requires the backend API to be running for full functionality
- CORS is enabled on the backend to allow frontend requests
- The application uses axios for HTTP requests
- Form validation is implemented on both client and server side
- The UI is designed to be responsive and user-friendly
