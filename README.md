# Pluto &nbsp; <img src="public/pluto-logo.svg" alt="Pluto Logo" height="36">

> **Intelligent Financial Insights Platform**  
> Modern, secure, and AI-powered personal finance management.

[![License](https://img.shields.io/github/license/smpdl/pluto)](LICENSE)


---

## Overview

**Pluto** is a full-stack platform for personal finance management, combining secure banking data aggregation, AI-driven insights, and a modern dashboard UI. Designed for individuals and small teams seeking actionable financial intelligence, Pluto streamlines account tracking, transaction analysis, and personalized recommendations.

- **Key Value Proposition:**  
	Unified financial data and actionable insights
- **Target Audience:**  
	individuals who would like to effectivley manage their personal finance

---

## Table of Contents

1. [Features](#features)
2. [Quick Start / Installation](#quick-start--installation)
3. [Usage](#usage)
4. [Contributing](#contributing)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [License](#license)
8. [Support / Contact](#support--contact)
9. [Acknowledgments](#acknowledgments)

---

## Features

- **Secure Account Aggregation:**  
	Connect and manage multiple bank accounts with robust security.
- **AI-Powered Insights:**  
	Automated analysis of spending, income, and investment patterns.
- **Modern Dashboard UI:**  
	Responsive, intuitive interface built with React and Vite.
- **Customizable Reports:**  
	Generate and export financial summaries.
- **Extensible API:**  
	RESTful endpoints for integration and automation.
- **Privacy-First Design:**  
	Local data storage and user-controlled access.
- **Open Source:**  
	MIT-licensed and community-driven.

---

## Quick Start / Installation

### Prerequisites

- **Python 3.12+**
- **Node.js 18+ & npm**
- **SQLite** (default, or configure your own DB)
- **macOS, Linux, or Windows**

### Installation Steps

```sh
# 1. Clone the repository
git clone https://github.com/smpdl/pluto.git
cd pluto

# 2. Set up Python backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 3. Set up frontend
npm install

# 4. Initialize the database
python app/db/init_db.py

# 5. Start backend server
uvicorn app.main:app --reload

# 6. Start frontend
npm run dev
```

---

## Usage

### Basic Example

```python
# Query AI insights (Python backend)
from app.ai.insights import get_insights
insights = get_insights(user_id=123)
print(insights)
```

```tsx
// Display dashboard (React frontend)
import Dashboard from './components/Dashboard';
export default function App() {
	return <Dashboard />;
}
```

### API Endpoints

- `POST /api/auth/login` — Authenticate user
- `GET /api/accounts` — List accounts
- `GET /api/transactions` — List transactions
- `POST /api/insights` — Get AI-powered insights

See [docs/API.md](docs/API.md) for full reference.

### Configuration

- **Backend:**  
	Edit `app/config.py` for environment variables and DB settings.
- **Frontend:**  
	Update `src/components/SettingsDashboard.tsx` for UI preferences.

---

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

- **Development Setup:**  
	Fork, clone, and set up `.venv` and `npm install` as above.
- **Coding Standards:**  
	- Python: [PEP8](https://peps.python.org/pep-0008/)
	- TypeScript: [Airbnb Style Guide](https://github.com/airbnb/javascript)
- **Pull Requests:**  
	- Create feature branches
	- Write tests for new features
	- Submit PRs with clear descriptions

---

## Testing

- **Backend:**  
	```sh
	pytest
	```
- **Frontend:**  
	```sh
	npm test
	```
- **Coverage:**  
	Reports generated via `pytest --cov` and `npm run coverage`.


---

## Deployment

- **Backend:**  
	Deploy with Docker, Gunicorn, or cloud platforms (see [docs/deployment.md](docs/deployment.md)).
- **Frontend:**  
	Build with `npm run build` and serve via static hosting.
- **Environment Variables:**  
	Configure in `.env` files for secrets and DB URLs.

---

## License

This project is licensed under the [MIT License](LICENSE).  
© 2025 Samip Paudel and contributors.

---

## Support / Contact

- **Issues:** [GitHub Issues](https://github.com/smpdl/pluto/issues)
- **Email:** spaudel@vassar.edu
- **Community:** [Discussions](https://github.com/smpdl/pluto/discussions)

---

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
- [pytest](https://pytest.org/)
- [SQLite](https://sqlite.org/)
- All contributors and third-party libraries listed in [requirements.txt](requirements.txt) and [package.json](package.json)

---
