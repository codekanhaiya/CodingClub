# 📚 CodingClub Management Web App

A complete **MERN Stack** application to register students, manage them through an admin dashboard, and send emails directly from the interface. Built for educational institutions to manage club activities with modern UI and powerful backend integration.

---

## 🧠 Table of Contents

- [📁 Folder Structure](#-folder-structure)
- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Setup Instructions](#️-setup-instructions)
- [🔐 Authentication](#-authentication)
- [📬 Email Feature](#-email-feature)
- [🧪 Future Enhancements](#-future-enhancements)
- [🙋‍♂️ Maintainer](#-maintainer)

---

## 📁 Folder Structure

```

CodingClub
|
|
├── client/             # React frontend
│   ├── public/         # Static files
│   ├── src/            # Source code
│   │   ├── Admin/      # Admin-specific pages (dashboard, email dialog)
│   │   ├── components/ # Reusable React components
│   │   ├── img/        # Images & assets
│   │   ├── utils/      # Utility functions
│   │   ├── App.js      # Main component
│   │   ├── index.js    # Entry point
│   │   ├── index.css   # Styles
│   │   └── reportWebVitals.js
│   ├── package.json    # Client dependencies
│   └── package-lock.json
│
├── server/             # Node.js + Express backend
│   ├── config/         # DB connection, constants
│   ├── controllers/    # Route logic (e.g., registration, login)
│   ├── middlewares/    # Middleware (auth, validation)
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API route handlers (e.g., /register, /send-email)
│   ├── .env            # Secrets and DB URI
│   ├── index.js        # Server entry point
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```
---



---

## 🚀 Features

- 📝 Student Registration Form with validation
- 🔐 JWT-based Admin Authentication
- 📄 Admin Dashboard with:
  - Student listing
  - Search and Pagination
  - Delete confirmation
  - Send Email dialog
- 📬 Email integration with Gmail App Passwords
- 🎨 Built using Material UI for professional UI/UX
- ✅ Form validation (Backend-first)
- 📦 Optimized project structure (MERN best practices)

---

## 🛠️ Tech Stack

| Category    | Tech Used                         |
|-------------|-----------------------------------|
| Frontend    | React, Material UI, JavaScript    |
| Backend     | Node.js, Express.js               |
| Database    | MongoDB + Mongoose                |
| Auth        | JWT (JSON Web Token)              |
| Email       | Nodemailer + Gmail SMTP           |
| State       | React Hooks (useState, useEffect) |
| Tools       | dotenv, cors, nodemon, validator  |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/codekanhaiya/CodingClub.git
cd coding-club
```

### 2. Environment Configuration
 Create .env inside /server/:
 ```bash
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```
### 3. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Run the App
```bash

# Start Backend
cd server
npm start

# Start Frontend (new terminal)
cd client
npm start

```
---

## 🔐 Authentication

Admin logs in and receives a JWT token stored in localStorage

Token is decoded using jwt-decode in the frontend

Protected backend routes verify the token via authMiddleware.js

---

## 📬 Email Feature

Emails are sent via: kanhaiyalaptop123@gmail.com

Uses Nodemailer configured with Gmail SMTP and App Password

Email is triggered via /api/send-email POST route

The email includes subject and content input from admin

Handles errors like:

    1. Invalid recipient (email not found)

    2. Network/server error

    3. SMTP rejection

---

## 🧪 Future Enhancements
🔒 Admin Login UI

📁 Upload resume/documents

✉️ Email template preview

🎯 Analytics dashboard for registrations

---
## 🙋‍♂️ Maintainer

### Kanhaiya Gupta

[![Website Badge](https://img.shields.io/badge/Visit-Website-blue)](http://officialkanha.epizy.com/)

📧 kanhaiyaguptaksg@gmail.com

