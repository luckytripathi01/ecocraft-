# EcoCraft 🌱

EcoCraft is an eco-friendly mobile application designed to help users identify waste, learn proper recycling methods, discover creative reuse ideas, and explore sustainable solutions.

## 🚀 Features

* ♻️ Waste identification using AI
* 📷 AI-powered waste scanning
* 💡 Creative recycling and reuse ideas
* 📚 Recycling guides and tutorials
* 🛒 Sustainable marketplace support
* 🔐 User authentication
* 🌱 Eco-friendly and sustainability-focused experience

## 🛠️ Tech Stack

### Frontend

* Expo
* React Native
* TypeScript
* Expo Router

### Backend

* Python
* FastAPI
* Uvicorn
* Ultralytics YOLO
* Google Gemini AI

### Planned

* MySQL Database
* Docker
* Cloud deployment

## 📁 Project Structure

```text
EcoCraftGitHub/
│
├── frontend/       # Expo React Native application
│
├── backend/        # FastAPI backend
│
├── .gitignore
└── README.md
```

## 💻 Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

## ⚙️ Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\activate
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🔐 Environment Variables

Backend API keys and secrets should be stored in a local `.env` file.

**Do not upload `.env` to GitHub.**

Example:

```env
GEMINI_API_KEY=your_api_key
```

Use your actual environment variables locally according to the backend configuration.

## 🌐 Frontend ↔ Backend

During local development, the frontend needs to communicate with the FastAPI backend.

The current project is being prepared to remove the dependency on manually entering a local Wi-Fi IP address.

The planned solution is to use **Docker and deployment**, so the application can communicate with the backend without depending on the developer's local network IP.

## 🐳 Docker & Database

Docker and MySQL are planned for the next development phase.

Planned architecture:

```text
        ┌───────────────┐
        │ Expo / Mobile │
        │   Frontend    │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │    FastAPI    │
        │    Backend    │
        └───────┬───────┘
                │
        ┌───────┴───────┐
        ▼               ▼
   ┌─────────┐     ┌──────────┐
   │  MySQL  │     │ AI/ML    │
   │ Database│     │ Services │
   └─────────┘     └──────────┘
```

## 🌿 Git & Team Workflow

The `master` branch is treated as the stable/main branch.

Team members should work on separate branches instead of directly modifying `master`.

Example:

```text
master
│
├── frontend-feature
├── backend-feature
└── database-feature
```

After completing work:

```text
Feature Branch
      ↓
   Push to GitHub
      ↓
 Pull Request
      ↓
Review
      ↓
Merge into master
```

## 🔒 Important

Do not commit:

* `.env`
* API keys
* Passwords
* Personal credentials
* `node_modules`
* Python virtual environments
* Generated runtime files

These files should remain local or be handled through proper deployment/environment configuration.

## 📌 Current Status

* ✅ Expo React Native frontend
* ✅ FastAPI backend
* ✅ AI waste detection
* ✅ GitHub repository
* ✅ Team-based Git workflow preparation
* 🔄 MySQL database integration
* 🔄 Docker setup
* 🔄 Backend deployment
* 🔄 Production API configuration

## 👥 Team Development

EcoCraft is being developed collaboratively using GitHub branches and Pull Requests.

Each team member can work independently on their assigned feature, while the project owner reviews and integrates completed changes into the `master` branch.
