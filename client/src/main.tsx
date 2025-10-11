/**
 * Application Entry Point
 * 
 * This file is the entry point for the React application. It sets up the React root
 * and renders the main App component into the DOM. This file is loaded by Vite
 * when the application starts and handles the initial mounting of the React component tree.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Initialize and render the React application
 * 
 * Steps:
 * 1. Find the root DOM element (defined in index.html)
 * 2. Create a React root using the modern createRoot API (React 18+)
 * 3. Render the App component wrapped in StrictMode for development benefits
 * 
 * StrictMode benefits:
 * - Identifies components with unsafe lifecycles
 * - Warns about legacy string ref API usage
 * - Warns about deprecated findDOMNode usage
 * - Detects unexpected side effects during development
 * - Helps ensure components are resilient to future React features
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
