/**
 * Vite Configuration File
 * 
 * This file configures Vite, the build tool and development server for the React frontend.
 * Vite provides fast development with Hot Module Replacement (HMR) and optimized production builds.
 * 
 * Official Vite documentation: https://vite.dev/config/
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite configuration for the Task Manager React application.
 * 
 * Configuration includes:
 * - React plugin for JSX/TSX support and Fast Refresh
 * - Default development server on port 5173
 * - TypeScript support out of the box
 * - Hot Module Replacement for fast development
 * - Optimized production builds with code splitting
 */
export default defineConfig({
  plugins: [
    // Enable React support with Fast Refresh for development
    // This plugin handles JSX/TSX transformation and provides hot reloading
    react()
  ],
  
  // Additional configuration options can be added here:
  // - server: { port: 3000 } to change development port
  // - build: { outDir: 'dist' } to change build output directory
  // - base: '/app/' for deployment to subdirectories
  // - define: { 'process.env': {} } for environment variables
})
