h# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `pnpm install` - Install dependencies
- `pnpm run serve` - Start development server (Vite dev server on port 5173)
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build

### Testing & Quality
- `pnpm run test` - Run unit tests (Vitest)
- `pnpm run coverage` - Run tests with coverage report
- `pnpm run e2e` - Run Playwright end-to-end tests
- `pnpm run lint` - ESLint code analysis for TypeScript and Vue files
- `pnpm run lint:fix` - Auto-fix linting issues
- `pnpm run format` - Check Prettier formatting
- `pnpm run format:fix` - Auto-format code with Prettier

### Single Test Execution
- `pnpm run test -- filename.test.ts` - Run specific unit test file
- `pnpm exec playwright test auth/login.spec.ts` - Run specific E2E test

## Project Architecture

This is a Vue 3 + TypeScript dictionary/quiz application built with Vite and Vuetify.

### Core Structure
- **Modular Architecture**: Code organized in feature modules (`auth`, `dictionary`, `quiz`, `profile`, `statistic`)
- **Vue 3 Composition API**: Uses `<script setup>` syntax throughout
- **State Management**: Custom storage layer with Pinia-style patterns
- **Routing**: Vue Router with authentication guards and meta-based access control

### Key Directories
- `src/modules/` - Feature modules with components, types, and logic
- `src/services/` - API services and external integrations (RDO pattern for data fetching)
- `src/storage/` - Client-side state management and persistence
- `src/utils/` - Shared utilities and helper functions
- `src/types/` - Global TypeScript type definitions
- `src/plugins/vuetify/` - Vuetify configuration and theming

### Module Structure Pattern
Each module follows this structure:
```
modules/{feature}/
├── components/     # Vue components
├── types/         # TypeScript interfaces
├── logic/         # Business logic (quiz module)
├── constants/     # Module-specific constants
└── utils/         # Module utilities
```

### Authentication & Routing
- Route guards check `isAuthorized` from `src/services/auth/auth.ts`
- Private routes require authentication, public routes redirect authenticated users
- Uses Vue Router with hash-based routing (`createWebHashHistory`)

### Testing Strategy
- **Unit Tests**: Vitest with `@vue/test-utils` for component testing
- **E2E Tests**: Playwright for browser automation
- **Coverage**: V8 coverage reporting
- Test files located in `src/components/tests/` and `src/storage/tests/`

### Path Aliases
- `@/` - Maps to `src/`
- `@services` - Maps to `src/services/`  
- `@utils` - Maps to `src/utils/`

### Environment Setup
Requires `.env` file in `env/` directory with:
```
VITE_SERVER_API_URL=http://localhost:3000
```

### Styling
- Vuetify 3 for UI components
- Custom SCSS in `src/styles/` with component-specific styles
- Uses Sass preprocessing for enhanced CSS features