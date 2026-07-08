// Base URL for the Express API.
// Set VITE_API_URL in .env when deploying so the frontend doesn't stay
// pointed at localhost in production.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
