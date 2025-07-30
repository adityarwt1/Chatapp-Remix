import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide navbar on auth pages
  if (["/login", "/register", "/forgot-password", "/"].includes(pathname)) {
    return null;
  }

  // Define navigation items
  const navItems = [
    { path: "/chat", label: "Messages" },
    { path: "/profile", label: "Profile" },
    { path: "/settings", label: "Settings" },
  ];

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/chat" // Changed from "/" to "/chat" since we hide on "/"
              className="text-2xl font-bold text-blue-600 hover:text-blue-700"
            >
              ChatApp
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/logout"
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Sign Out
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-2">
                <Link
                  to="/logout"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
