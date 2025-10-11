# Task Manager with AI Travel Assistant

A full-stack **CRUD task management application** with an integrated **AI-powered travel assistant** built as a learning project to explore modern web development technologies.

## 🚀 Tech Stack

**Frontend:**

- React 19.1.1 with TypeScript
- Vite for build tooling and dev server
- ESLint for code quality
- Modern CSS with animations

**Backend:**

- ASP.NET Core (.NET 9.0)
- Entity Framework Core 9.0 with SQLite
- RESTful API with controller-based routing
- Integration with Ollama AI for chat functionality

**AI/ML:**

- Ollama (Local LLM runtime)
- Llama 3.2:1b model for travel assistance

**Database:**

- SQLite for local development

---

## ✨ Features

### Task Management

- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Task Tracking**:
  - Title (required, max 200 characters)
  - Description (optional)
  - Status tracking (Todo, In Progress, Done)
- **Real-time Updates**: Optimistic UI updates for smooth user experience

### AI Travel Assistant 🤖✈️

- **Interactive Chat Interface**: Floating chat widget with modern UI
- **AI-Powered Responses**: Integration with Ollama for intelligent travel suggestions
- **Service Health Monitoring**: Real-time status indicator for AI service
- **Smart Features**:
  - Auto-scroll to latest messages
  - Typing indicators
  - Clear chat history
  - Error handling with user-friendly messages

### Technical Features

- **Modern Frontend**: Responsive React components with TypeScript
- **REST API**: Clean API endpoints with proper HTTP status codes
- **Environment Configuration**: .env files for flexible deployment
- **CORS Configuration**: Proper cross-origin setup for development
- **Comprehensive Documentation**: Well-commented code throughout

---

## 📁 Project Structure

```
Task-Manager/
├── TaskApi/                      # ASP.NET Core backend
│   ├── Controllers/
│   │   ├── TasksController.cs    # CRUD API endpoints
│   │   └── ChatController.cs     # AI chat endpoints
│   ├── Data/
│   │   └── AppDbContext.cs       # EF Core database context
│   ├── Models/
│   │   ├── TaskItem.cs           # Task entity model
│   │   └── TaskDtos.cs           # Data transfer objects
│   ├── Migrations/               # EF Core database migrations
│   ├── Program.cs                # Application entry point & .env loader
│   ├── .env                      # Environment variables (AI config, CORS)
│   └── tasks.db                  # SQLite database file
├── client/                       # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.tsx      # Task creation/editing form
│   │   │   ├── TaskItemRow.tsx   # Individual task display
│   │   │   ├── TaskList.tsx      # Task list container
│   │   │   └── TravelChat.tsx    # AI travel assistant chat widget
│   │   ├── api.ts                # API service layer
│   │   ├── App.tsx               # Main application component
│   │   ├── index.css             # Global styles + chat styles
│   │   └── main.tsx              # React entry point
│   ├── .env                      # Frontend environment variables
│   ├── package.json
│   └── vite.config.ts
├── .gitignore                    # Git ignore rules (.env files excluded)
└── README.md
```

---

## 🛠 Getting Started

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)
- [Ollama](https://ollama.ai/) (for AI chat functionality)

### 1. Ollama Setup (AI Assistant)

1. **Install Ollama:**

   - Download from [ollama.ai](https://ollama.ai/)
   - Or use package manager:

     ```bash
     # macOS
     brew install ollama

     # Linux
     curl https://ollama.ai/install.sh | sh
     ```

2. **Pull the AI model:**

   ```bash
   ollama pull llama3.2:1b
   ```

3. **Start Ollama service:**

   ```bash
   ollama serve
   ```

   The service will run on `http://localhost:11434` by default.

### 2. Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd TaskApi
   ```

2. **Create `.env` file:**

   ```bash
   # TaskApi/.env
   OLLAMA_API_URL=http://localhost:11434/api/generate
   OLLAMA_TAGS_URL=http://localhost:11434/api/tags
   OLLAMA_MODEL=llama3.2:1b
   CORS_ALLOWED_ORIGINS=http://localhost:5173;http://localhost:3000
   ```

3. **Restore .NET dependencies:**

   ```bash
   dotnet restore
   ```

4. **Apply database migrations:**

   ```bash
   dotnet ef database update
   ```

5. **Start the API server:**
   ```bash
   dotnet run
   ```

The API will be available at `http://localhost:5049` (port may vary - check console output).

### 3. Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd client
   ```

2. **Create/verify `.env` file:**

   ```bash
   # client/.env
   VITE_API_BASE_URL=http://localhost:5049
   ```

3. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The React app will be available at `http://localhost:5173`.

### 🎉 You're Ready!

Open `http://localhost:5173` in your browser. You should see:

- Task management interface at the top
- Floating chat button (✈️) at the bottom right
- Green status indicator when Ollama is running

---

## 🔌 API Endpoints

### Task Management Endpoints

| Method   | Endpoint          | Description          |
| -------- | ----------------- | -------------------- |
| `GET`    | `/api/tasks`      | Get all tasks        |
| `GET`    | `/api/tasks/{id}` | Get task by ID       |
| `POST`   | `/api/tasks`      | Create new task      |
| `PUT`    | `/api/tasks/{id}` | Update existing task |
| `DELETE` | `/api/tasks/{id}` | Delete task          |

### AI Chat Endpoints

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| `POST` | `/api/chat`        | Send message to AI assistant |
| `GET`  | `/api/chat/health` | Check Ollama service status  |

### Health Check

| Method | Endpoint  | Description             |
| ------ | --------- | ----------------------- |
| `GET`  | `/health` | API server health check |

### Request/Response Examples

**Create Task:**

```json
POST /api/tasks
{
  "title": "Learn React",
  "description": "Complete the React tutorial",
  "status": 0
}
```

**Response:**

```json
{
  "id": 1,
  "title": "Learn React",
  "description": "Complete the React tutorial",
  "status": 0
}
```

**Send Chat Message:**

```json
POST /api/chat
{
  "message": "What are the best places to visit in Paris?"
}
```

**Response:**

```json
{
  "message": "Paris offers incredible attractions like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral. Don't miss charming neighborhoods like Montmartre and the Latin Quarter. Spring and fall are ideal times to visit for pleasant weather and fewer crowds.",
  "model": "llama3.2:1b"
}
```

---

## 🏗 Architecture Overview

### Backend Architecture

- **Controllers**: Handle HTTP requests and responses
  - `TasksController`: Task CRUD operations
  - `ChatController`: AI chat integration with Ollama
- **Models**: Define data structures and DTOs
- **Data Layer**: Entity Framework Core with SQLite
- **Migrations**: Database version control
- **Environment Configuration**: .env file loading for flexible deployment

### Frontend Architecture

- **Components**: Modular React components with TypeScript
  - Task management components (TaskForm, TaskList, TaskItemRow)
  - TravelChat component for AI interaction
- **State Management**: React hooks (useState, useEffect, useRef)
- **API Layer**: Centralized API service with fetch
- **Build System**: Vite for fast development and optimized builds
- **Styling**: Modern CSS with animations and responsive design

### AI Integration Architecture

```
┌─────────────────┐
│  React Frontend │
│  (TravelChat)   │
└────────┬────────┘
         │ HTTP POST /api/chat
         ▼
┌─────────────────┐
│  ASP.NET Core   │
│  ChatController │
└────────┬────────┘
         │ HTTP POST
         ▼
┌─────────────────┐
│  Ollama Service │
│  (llama3.2:1b)  │
└─────────────────┘
```

### Communication Flow

1. React frontend makes HTTP requests to ASP.NET Core API
2. API processes task requests and interacts with SQLite via EF Core
3. Chat requests are forwarded to local Ollama service
4. Ollama generates AI responses using the configured model
5. CORS middleware enables secure cross-origin requests
6. Real-time UI updates provide smooth user experience
7. Environment variables ensure configuration flexibility

---

## 🚀 Available Scripts

### Backend (TaskApi)

- `dotnet run` - Start the API server
- `dotnet build` - Build the application
- `dotnet ef database update` - Apply migrations
- `dotnet ef migrations add <name>` - Create new migration

### Frontend (client)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🔧 Development Notes

### General

- **Hot Reload**: Both frontend and backend support hot reload during development
- **Type Safety**: Full TypeScript support with strict type checking
- **Code Quality**: ESLint configuration for consistent code style
- **Database**: SQLite database file is created automatically on first run
- **CORS**: Configured to allow requests from React dev server

### Environment Variables

- **Security**: `.env` files are gitignored and never committed
- **Backend (.env)**: Contains Ollama URLs, model name, and CORS origins
- **Frontend (.env)**: Contains API base URL for backend communication
- **Fallback**: Code includes empty string fallbacks if env vars are missing

### AI Chat Feature

- **Ollama Required**: Chat functionality requires Ollama to be running
- **Status Indicator**: Green = online, Red = offline, Yellow = checking
- **Error Handling**: User-friendly messages when service is unavailable
- **Model Configuration**: Easy to switch models via environment variable

### Code Documentation

- **C# Comments**: XML documentation comments for all public APIs
- **TypeScript Comments**: JSDoc-style comments explaining component behavior
- **Inline Comments**: Detailed explanations for complex logic

---

## 📝 Task Status Options

- **0 (Todo)**: Task is planned but not started
- **1 (In Progress)**: Task is currently being worked on
- **2 (Done)**: Task has been completed

---

## 🔒 Security Notes

- **Environment Variables**: Never commit `.env` files to version control
- **Local AI**: Ollama runs locally, no data sent to external APIs
- **CORS**: Properly configured to only allow specified origins
- **API Validation**: Input validation on all endpoints

---

## 🐛 Troubleshooting

### Chat Not Working

1. Ensure Ollama is installed and running: `ollama serve`
2. Verify model is downloaded: `ollama list`
3. Check backend `.env` file has correct Ollama URLs
4. Look for errors in browser console and API logs

### Backend Connection Issues

1. Verify backend is running: `http://localhost:5049/health`
2. Check frontend `.env` has correct API URL
3. Ensure CORS origins match your frontend URL

### Database Issues

1. Delete `tasks.db` file
2. Run migrations again: `dotnet ef database update`

---

## 🚀 Future Enhancements

- [ ] User authentication and authorization
- [ ] Task categories and tags
- [ ] Due dates and reminders
- [ ] Multi-language support for AI chat
- [ ] Chat history persistence
- [ ] Task templates
- [ ] Export/import functionality
- [ ] Dark mode toggle
