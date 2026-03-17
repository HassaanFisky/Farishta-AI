# Farishta-AI Copilot Instructions

This document provides guidance for AI coding assistants to effectively contribute to the `farishta-ai` codebase.

## 1. Project Overview & Architecture

`farishta-ai` is a Next.js application built with React and TypeScript. The primary goal of the project is to [**Please describe the main purpose of your application here**].

Key architectural points:
- **Frontend**: Built with React components, likely located in a `/components` or `/src/components` directory.
- **Backend/API**: API routes are defined in `pages/api/` or `app/api/` as per Next.js conventions.
- **Styling**: [**Describe your styling solution, e.g., Tailwind CSS, CSS Modules, styled-components**].
- **State Management**: [**Describe your state management library, e.g., React Context, Zustand, Redux**].

## 2. Developer Workflow

### Setup
To get started, clone the repository and install dependencies:
```bash
git clone <repository-url>
cd farishta-ai
npm install
```

### Running the App
- **Development**: `npm run dev` - Starts the development server with hot-reloading.
- **Production Build**: `npm run build` followed by `npm run start`.

### Testing
- [**Describe your testing strategy and commands, e.g., `npm test` for Jest/React Testing Library, or `npm run test:e2e` for Playwright/Cypress**].

## 3. Code Conventions

- **Environment Variables**: Environment variables are managed via `.env.*` files and loaded by Next.js. Access them using `process.env.VARIABLE_NAME`. See `e:\Hassaan-personal back up\Desktop\farishta-ai\node_modules\@next\env\dist\index.js` for the loading mechanism.
- **File System Operations**: Use the promise-based `fs/promises` API for any server-side file operations for cleaner async/await syntax. Example: `import { readFile } from 'node:fs/promises';`.
- **React Components**: Please use functional components with Hooks. All components should be typed using TypeScript.
