import { Navigate } from "react-router-dom";
import type { JSX } from "react";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
}
