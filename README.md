# Proper Exercise Suggestion AI

![Project Status](https://img.shields.io/badge/Status-Active-success.svg)
![License](https://img.shields.io/badge/License-ISC-blue.svg)

## Overview
Proper Exercise Suggestion AI is a full-stack web application designed to assist users with physical therapy and fitness training. By leveraging computer vision and machine learning, the application tracks user movements in real-time through a webcam and provides intelligent exercise suggestions. 

## ✨ Features
- **Real-time Pose Detection**: Utilizes Google's MediaPipe to accurately track body posture and movements through the user's webcam.
- **AI Exercise Suggestions**: Analyzes user data and poses to suggest appropriate exercises from a comprehensive dataset of over 10,000 physical therapy exercises.
- **Interactive 3D Visualizations**: Uses Three.js and React Three Fiber to render engaging 3D environments and models.
- **User Dashboard & Analytics**: Includes user authentication and dashboards with beautiful charts (Recharts) to track fitness progress over time.
- **Modern User Interface**: Built with React, Tailwind CSS, and Framer Motion for a sleek, responsive, and highly interactive user experience.

## 🛠️ Tech Stack

### Frontend
- **Core**: React 18, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **AI & Computer Vision**: `@mediapipe/pose`, `@mediapipe/camera_utils`
- **Data Visualization**: Recharts
- **Routing**: React Router DOM

### Backend
- **Core**: Node.js, Express.js
- **Database**: MongoDB (Mongoose) & SQLite (better-sqlite3)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Data Processing**: csv-parser (for loading the large dataset)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB database (local or cloud like MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohith9191/AI-ML-Project.git
   cd AI-ML-Project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory with your environment variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```
   - Start the backend server:
     ```bash
     node index.js
     ```
     *(Note: Ensure you run the data loader to populate the exercise database from the provided CSV dataset).*

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   - Create a `.env` file in the `frontend` directory if needed (e.g., for `VITE_API_BASE_URL`).
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Run the Application**
   Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## 📄 Dataset
This project utilizes the `physical_therapy_exercises_dataset_10000.csv` file, which contains a rich library of exercises used for making intelligent therapy and fitness suggestions.
