# Task Manager

A full-stack **CRUD task management application** built as a learning project to explore modern web development technologies.

## 🚀 Tech Stack

**Frontend:**

- React 19.1.1 with TypeScript
- Vite for build tooling and dev server
- ESLint for code quality

**Backend:**

- ASP.NET Core (.NET 9.0)
- Entity Framework Core 9.0 with SQLite
- RESTful API with controller-based routing

**Database:**

- SQLite for local development

---

## ✨ Features

- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Task Management**:
  - Title (required, max 200 characters)
  - Description (optional)
  - Status tracking (Todo, In Progress, Done)
- **Modern Frontend**: Responsive React components with TypeScript
- **REST API**: Clean API endpoints with proper HTTP status codes
- **Real-time Updates**: Optimistic UI updates for smooth user experience
- **CORS Configuration**: Proper cross-origin setup for development

---

## 📁 Project Structure

```
Task-Manager/
├── TaskApi/                    # ASP.NET Core backend
│   ├── Controllers/
│   │   └── TasksController.cs  # CRUD API endpoints
│   ├── Data/
│   │   └── AppDbContext.cs     # EF Core database context
│   ├── Models/
│   │   ├── TaskItem.cs         # Task entity model
│   │   └── TaskDtos.cs         # Data transfer objects
│   ├── Migrations/             # EF Core database migrations
│   ├── Program.cs              # Application entry point
│   └── tasks.db               # SQLite database file
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.tsx    # Task creation/editing form
│   │   │   ├── TaskItemRow.tsx # Individual task display
│   │   │   └── TaskList.tsx    # Task list container
│   │   ├── api.ts             # API service layer
│   │   ├── App.tsx            # Main application component
│   │   └── main.tsx           # React entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🛠 Getting Started

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd TaskApi
   ```

2. **Restore .NET dependencies:**

   ```bash
   dotnet restore
   ```

3. **Apply database migrations:**

   ```bash
   dotnet ef database update
   ```

4. **Start the API server:**
   ```bash
   dotnet run
   ```

The API will be available at `http://localhost:5049` (port may vary - check console output).

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd client
   ```

2. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The React app will be available at `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method   | Endpoint          | Description          |
| -------- | ----------------- | -------------------- |
| `GET`    | `/api/tasks`      | Get all tasks        |
| `GET`    | `/api/tasks/{id}` | Get task by ID       |
| `POST`   | `/api/tasks`      | Create new task      |
| `PUT`    | `/api/tasks/{id}` | Update existing task |
| `DELETE` | `/api/tasks/{id}` | Delete task          |
| `GET`    | `/health`         | Health check         |

### Request/Response Examples

**Create Task:**

```json
POST /api/tasks
{
  "title": "Learn React",
  "description": "Complete the React tutorial",
  "status": "Todo"
}
```

**Response:**

```json
{
  "id": 1,
  "title": "Learn React",
  "description": "Complete the React tutorial",
  "status": "Todo"
}
```

---

## 🏗 Architecture Overview

### Backend Architecture

- **Controllers**: Handle HTTP requests and responses
- **Models**: Define data structures and DTOs
- **Data Layer**: Entity Framework Core with SQLite
- **Migrations**: Database version control

### Frontend Architecture

- **Components**: Modular React components with TypeScript
- **State Management**: React hooks (useState, useEffect)
- **API Layer**: Centralized API service with fetch
- **Build System**: Vite for fast development and optimized builds

### Communication Flow

1. React frontend makes HTTP requests to ASP.NET Core API
2. API processes requests and interacts with SQLite database via EF Core
3. CORS middleware enables secure cross-origin requests
4. Real-time UI updates provide smooth user experience

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

- **Hot Reload**: Both frontend and backend support hot reload during development
- **Type Safety**: Full TypeScript support with strict type checking
- **Code Quality**: ESLint configuration for consistent code style
- **Database**: SQLite database file is created automatically on first run
- **CORS**: Configured to allow requests from React dev server

---

## 📝 Task Status Options

- **Todo**: Task is planned but not started
- **In Progress**: Task is currently being worked on
- **Done**: Task has been completed
