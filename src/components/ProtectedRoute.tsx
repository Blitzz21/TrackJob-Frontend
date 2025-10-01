import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  // Get token from localStorage or sessionStorage
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the children (dashboard, etc.)
  return children;
}
