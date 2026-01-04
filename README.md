# TaskPilot AI

GenAI Developer Productivity Platform - A modern platform for code analysis and GitHub repository management powered by OpenAI and GitHub APIs.

## Features

- 🤖 **AI Code Summary**: Get intelligent code summaries using OpenAI models (GPT-5.1, GPT-4o, GPT-4, etc.)
- ⚙️ **Model Selection**: Choose from multiple AI models based on your needs
- 🔗 **GitHub Integration**: Browse and analyze GitHub repositories
- 📊 **Clean Dashboard**: Modern UI built with React and Tailwind CSS
- 🐳 **Docker Support**: Easy deployment with Docker

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Axios

### Backend
- Express.js
- OpenAI API
- GitHub API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API Key
- GitHub Personal Access Token (optional, for private repos)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskpilot-ai
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit `.env` and add your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
GITHUB_TOKEN=your_github_token_here
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Running the Application

#### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:

Backend:
```bash
npm run server
```

Frontend:
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000 (or 5001 if 5000 is occupied)

**Note**: If port 5000 is already in use, the backend will automatically use port 5001. The frontend is configured to connect to port 5001 by default. You can change this in `client/src/config/api.js` or set the `REACT_APP_API_PORT` environment variable.

#### Production Mode with Docker

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Or build and run with Docker:
```bash
docker build -t taskpilot-ai .
docker run -p 5000:5000 --env-file .env taskpilot-ai
```

The application will be available at http://localhost:5000

## API Endpoints

### Code Summary
- `GET /api/code-summary/models` - Get available AI models
- `POST /api/code-summary` - Generate AI code summary
  - Body: `{ code: string, language?: string, model?: string }`
  - Available models: `gpt-5.1`, `gpt-4o`, `gpt-4-turbo`, `gpt-4`, `gpt-3.5-turbo`

### GitHub
- `GET /api/github/repos/:owner/:repo` - Get repository information
- `GET /api/github/repos/:owner/:repo/contents/:path?` - Get repository contents
- `GET /api/github/repos/:owner/:repo/commits` - Get repository commits
- `GET /api/github/repos/:owner/:repo/languages` - Get repository languages
- `GET /api/github/user/repos` - Get authenticated user's repositories

### Health Check
- `GET /api/health` - Server health status

## Project Structure

```
taskpilot-ai/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── CodeSummary.js
│   │   │   └── GitHubRepos.js
│   │   ├── config/         # Configuration files
│   │   │   └── api.js      # API configuration
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Express backend
│   ├── config/             # Configuration files
│   │   └── models.js       # AI models configuration
│   ├── routes/             # API routes
│   │   ├── codeSummary.js
│   │   └── github.js
│   ├── index.js
│   └── package.json
├── Dockerfile
├── docker-compose.yml
├── env.example           # Environment variables template
├── .gitignore
├── .dockerignore
└── README.md
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `GITHUB_TOKEN` | GitHub personal access token | Optional |
| `CLIENT_URL` | Frontend URL for CORS | No (default: http://localhost:3000) |

### Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Full API base URL | No (default: auto-configured) |
| `REACT_APP_API_PORT` | Backend API port | No (default: 5001) |

## Usage

### Code Summary

1. Navigate to the "Code Summary" tab
2. Select an AI model (GPT-5.1 is recommended)
3. Choose the programming language
4. Paste your code in the text area
5. Click "Generate Summary" to get an AI-powered analysis

### GitHub Integration

1. Navigate to the "GitHub Repos" tab
2. Choose to either:
   - Load your repositories (requires GitHub token)
   - Search for a specific repository by owner and name
3. View repository details, languages, and statistics

## Troubleshooting

### Port Conflicts

If port 5000 is occupied (common on macOS due to AirPlay), the backend will automatically use port 5001. The frontend is pre-configured to connect to port 5001. If you need to use a different port:

1. Update `client/src/config/api.js` to change the default port
2. Or set `REACT_APP_API_PORT` environment variable before starting the frontend

### Permission Issues

If you encounter permission errors with ESLint cache:

```bash
sudo chown -R $(whoami) client/node_modules server/node_modules
```

Or reinstall dependencies:

```bash
rm -rf client/node_modules server/node_modules
npm run install-all
```

## License

MIT

