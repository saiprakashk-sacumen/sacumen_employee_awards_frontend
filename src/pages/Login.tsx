import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Award, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // 1) Start empty (no hardcoded demo creds)
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(credentials.username, credentials.password);
      // AuthContext handles token/role and sets isAuthenticated.
    } catch (err: any) {
      // 2) Better error messages from backend if available
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative">
      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="absolute top-4 right-4"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Employee Awards
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Automation Platform
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Sign in to your account
              </h2>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              value={credentials.username}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              required
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              required
              placeholder="Enter your password"
            />

            {/* 4) Optional: disable until filled */}
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={
                isSubmitting || !credentials.username || !credentials.password
              }
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            {/* 3) Optional: remove the demo credentials block */}
          </form>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
