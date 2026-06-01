# 🍏 AI Nutrition Tracker - MADE BY Hitarth Pareek

> An AI-powered nutrition tracking platform that helps users analyze meals, monitor nutrition intake, achieve fitness goals, and gain personalized health insights.
---
## 🚀 Overview

AI Nutrition Tracker is a full-stack nutrition management application that combines AI meal analysis, data visualization, goal tracking, and real-time analytics into a single platform.

Users can describe meals in natural language and instantly receive nutritional breakdowns, health scores, and personalized recommendations.

---

## ✨ Features

### 🤖 AI Meal Analysis

Analyze meals using natural language.

Example:

> "2 chapati, dal, rice and salad"

The system automatically generates:

* Calories
* Protein
* Carbohydrates
* Fats
* Health Score
* Nutrition Recommendations

---

### 📊 Smart Dashboard

Track daily nutrition performance with:

* Calories Today
* Protein Intake
* Meals Logged
* Health Score
* Recent Meals
* AI Recommendations

---

### 🎯 Goal Tracking

Set and monitor:

* Daily Calorie Goals
* Daily Protein Goals

Features:

* Progress Indicators
* Goal Completion Tracking
* Achievement Monitoring

---

### 📈 Analytics & Charts

Visualize nutrition trends using:

* Macronutrient Distribution Chart
* Weekly Calorie Consumption Chart
* Health Insights Dashboard

Built using Recharts.

---

### 📄 PDF Reports

Generate downloadable nutrition reports containing:

* Average Calories
* Average Protein
* Health Score Statistics
* Goal Achievement Metrics
* Meal History Summary

---

### 👤 Authentication & User Management

* Email/Password Login
* Google Sign-In
* Password Reset via Email
* Protected Routes
* Persistent Sessions
* User Profile Management

---

### 🔐 Security

* Firebase Authentication
* Firestore User Isolation
* Route Protection
* Secure Password Reset

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Tailwind CSS
* Recharts
* Lucide React

### Backend

* Firebase Firestore
* Firebase Authentication

### AI

* AI-powered nutrition analysis service

### Reporting

* jsPDF
* jspdf-autotable

### Notifications

* React Hot Toast

---

## 📂 Project Structure

```bash
src
│
├── components
│   ├── Navbar.jsx
│   ├── MealForm.jsx
│   ├── AnalysisResult.jsx
│   ├── GoalProgress.jsx
│   ├── MacroChart.jsx
│   ├── WeeklyCaloriesChart.jsx
│   ├── RecentMeals.jsx
│   └── StatsCard.jsx
│
├── pages
│   ├── Dashboard.jsx
│   ├── History.jsx
│   ├── Reports.jsx
│   ├── Profile.jsx
│   ├── Login.jsx
│   └── Register.jsx
│
├── hooks
│   └── useDashboardData.js
│
├── services
│   ├── firebase.js
│   ├── aiService.js
│   └── goalService.js
│
└── context
    └── AuthContext.jsx
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/ai-nutrition-tracker.git
cd ai-nutrition-tracker
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_GEMINI_API=YOUR_API_KEY
```

### Run Project

```bash
npm run dev
```

---

## 🎯 Future Enhancements

* Food Image Recognition
* Barcode Scanner
* Water Intake Tracking
* Workout Tracking
* AI Meal Suggestions
* Nutrition Forecasting
* Dark Mode
* Mobile App Version

---

## 💡 Key Learnings

This project demonstrates:

* React Development
* Firebase Integration
* Authentication Systems
* AI Service Integration
* State Management
* Real-Time Data Handling
* Data Visualization
* Responsive UI Design
* SaaS-style Architecture

---

## 👨‍💻 Developer

### Hitarth Pareek

Frontend Developer | React Developer | Firebase Developer

Passionate about building scalable web applications that combine AI, analytics, and modern technologies to solve real-world problems.

---

## ⭐ If you like this project

Give it a star on GitHub and feel free to contribute!
