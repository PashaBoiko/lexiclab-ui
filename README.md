# 🚀 Lexiclab UI

A user interface for managing dictionaries, engaging in quizzes and tracking user statistics.

---

## 🛠️ Tech Stack

- **Vue 3** (for modern UI development)
- **TypeScript** (for static typing and robust development)
- **Vite** (for fast development, build tooling, and HMR)
- **Vue Router** (for navigation and route management)
- **Pinia** (for state management)
- **Chart.js** (for visualizing data and statistics)
- **Sass** (for styling and CSS pre-processing)

---

## ⚙️ Environment Variables

Create the following environment files in the `env` directory:

### `.env`

```env
VITE_SERVER_API_URL=http://localhost:3000
```

---

## 🚦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd dictionary-api
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```

---

## 📦 Available Scripts

- `pnpm run serve` — Start the application with nodemon (development)
- `pnpm run e2e` — Runs Playwright end-to-end tests to ensure the application works correctly in a browser environment.
- `pnpm run lint` — Uses ESLint to analyze the code for syntax and style issues in `.ts` and `.vue` files.
- `pnpm run lint:fix` — Runs ESLint with the `--fix` option to automatically resolve some of the linting issues.
- `pnpm run test` — Runs unit tests using Vitest, ensuring the integrity of smaller functional components of the application.
- `pnpm run format` — Checks whether the code follows Prettier formatting rules without making any changes.
- `pnpm run format:fix` — Automatically formats the codebase using Prettier, adhering to predefined style rules.
- `pnpm run build` — Builds the application for production, optimizing it for deployment.

---
