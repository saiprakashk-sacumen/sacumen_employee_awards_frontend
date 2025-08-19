import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Brain,
  Settings,
  Award,
  Plus,
  Trophy,
} from "lucide-react";
import { cn } from "../../utils/cn";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Onboarding Manager", href: "/onboarding-manager", icon: FileText },
  { name: "Nominations", href: "/nominations", icon: Award },
  { name: "Submit Nomination", href: "/submit-nomination", icon: Plus },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Sentimental Insights", href: "/sentimental-insights", icon: Brain },
  { name: "Employee Metrics", href: "/employee-metrics", icon: BarChart3 },
  { name: "Top Nominees", href: "/top-nominees", icon: Trophy },
  { name: "AI Insights", href: "/ai-insights", icon: Brain },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isCollapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Award className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Awards
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                )}
              />
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
