import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const navLinks = isLoggedIn
    ? [
        { name: "Dashboard", to: "/dashboard" },
        { name: "Follow-ups", to: "/followups" },
        { name: "Settings", to: "/settings" },
      ]
    : [];

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#0f1724] rounded-md flex items-center justify-center text-white font-bold">
            T
          </div>
          <span className="text-xl font-semibold text-[#0f1724]">TrackJob</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-sm text-gray-700 hover:underline">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#0f1724] text-white rounded-md text-sm shadow"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-gray-700 hover:underline"
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-sm px-3 text-red-700 py-2 border bg-red-300 border-red-600 rounded-md hover:bg-red-400/80 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t shadow-sm"
          >
            <div className="flex flex-col items-start p-4 gap-3">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="text-sm text-gray-700 hover:underline w-full"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="text-sm text-white bg-[#0f1724] px-4 py-2 rounded-md shadow w-full text-center"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={toggleMenu}
                      className="text-sm text-gray-700 hover:underline w-full"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="text-sm text-red-700 w-full text-left bg-red-300 border border-red-600 hover:bg-gray-50 px-2 py-1 rounded-md"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
