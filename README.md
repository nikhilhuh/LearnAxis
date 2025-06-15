# 📚 LearnAxis

**LearnAxis** is a comprehensive **school/college/university management system** designed to manage Students, Teachers, and Admins efficiently. It offers a modular structure, real-time-ready architecture, and theme customizations (including dark mode). Built with **React + TypeScript** on the frontend and **Node.js + Express + TypeScript** on the backend.

---

## 🚀 Features

### 🔐 Authentication
- Secure **Sign Up / Login** for Students.
- **Login** for Teachers and Admins.
- Role-based dashboards.

### 🎓 Student Features
- View dashboard with:
  - Enrolled Subjects
  - Attendance statistics
  - Assigned Batches
- Enroll in new subjects
- Theme settings (color & dark mode)
- Logout securely

### 👨‍🏫 Teacher Features
- View dashboard and assigned batches
- View students in each batch
- Mark attendance
- Theme settings and logout

### 🛠️ Admin Features
- View dashboard with controls
- Add/Remove:
  - Subjects
  - Rooms
  - Teachers
  - Batches
- Manage users
- Theme settings and logout

---

## 🧑‍💻 Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS v4
- Axios
- Context API
- React Router
- Socket.IO client (setup for future use)

### Backend
- Node.js + Express + TypeScript
- MongoDB with Mongoose
- Socket.IO
- CORS
- Modular Controllers, Routes, Middleware
- Environment-based config

---

## 📁 Folder Structure

### Frontend (`frontend/`)
```
src/
├── assets/         # Images, icons, etc.
├── components/     # Reusable UI components
├── context/        # Auth, theme, and user context
├── pages/          # Role-based page components
├── routes/         # Route definitions and protections
├── services/       # API calls via Axios
├── utils/          # Constants, helpers, etc.
├── main.tsx        # App entry point
└── App.tsx         # Root app component
```

### Backend (`backend/`)
```
src/
├── configs/        # DB and environment config
├── middleware/     # Auth, error handling, etc.
├── models/         # Mongoose schemas
├── routes/         # API endpoints
├── utils/          # Helpers like hashing, tokens, etc.
├── app.ts          # Express app setup
└── server.ts       # Server and socket initialization
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/nikhilhuh/LearnAxis.git
cd /LearnAxis
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 4. Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file inside the `frontend/` directory:

```env
VITE_BACKEND_URL=http://localhost:4000
```
---

## 🔮 Upcoming Features

- Real-time notifications (via Socket.IO)
- In-app chat system
- Exams/Test module (typed + PDF)
- Admin analytics dashboard
- Two-factor authentication
- Multi-role account support

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push to GitHub: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

Currently **NO LICENSE**.

---

## 📬 Contact

- GitHub Issues: [Open here](https://github.com/nikhilhuh/LearnAxis/issues)
- Email: nikhilhuh@gmail.com

---

## 🌐 Live Demo

(https://learnaxis.onrender.com)
