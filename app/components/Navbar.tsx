"use client";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Upload } from "lucide-react";

const Navbar = () => {
  const [isScroll, setIsScroll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScroll(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to review section if Analyze clicked
  const handleAnalyzeClick = () => {
    if (location.pathname === "/") {
      const section = document.getElementById("review-submissions");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to home with #review-submissions
      window.location.href = "/#review-submissions";
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Upload Resume", href: "/upload" },
    { label: "Analyzer", href: "#", onClick: handleAnalyzeClick },
  ];

  return (
    <nav
      className={`fixed top-0 w-full px-5 lg:px-8 xl:px-[8%] py-4 flex items-center justify-between z-50 transition-all duration-300 ${
        isScroll ? "bg-white/50 backdrop-blur-lg shadow-sm" : ""
      }`}
    >
      {/* Logo */}
      <Link
        to="/"
        className="cursor-pointer font-bold tracking-wide text-[28px] font-ovo"
      >
        <span className="text-black">Resu</span>
        <span className="text-amber-600">Mind</span>
      </Link>

      {/* Desktop Menu */}
      <motion.ul
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hidden md:flex items-center gap-6 lg:gap-8 rounded-full px-8 py-2 bg-white/50 backdrop-blur-lg shadow-sm"
      >
        {navLinks.map((link, idx) => (
          <motion.li
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {link.onClick ? (
              <button
                onClick={link.onClick}
                className="font-ovo text-gray-800 hover:text-amber-600 transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                to={link.href}
                className="font-ovo text-gray-800 hover:text-amber-600 transition-colors"
              >
                {link.label}
              </Link>
            )}
          </motion.li>
        ))}
      </motion.ul>

      {/* Right Side CTA */}
      <div className="flex items-center gap-4">
        <Link
          to="/upload"
          className="hidden lg:flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all"
        >
          <Upload size={18} />
          Upload
        </Link>

        {/* Mobile menu button */}
        <button
          className="block md:hidden"
          onClick={() => setMenuOpen(true)}
          title="Open menu"
        >
          <Menu className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120 }}
            className="flex md:hidden flex-col py-20 px-10 fixed top-0 right-0 w-64 h-screen bg-amber-50 z-50 space-y-4"
          >
            <div
              className="absolute top-6 right-6 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              <X className="w-6 h-6 text-gray-700" />
            </div>

            {navLinks.map((link, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                {link.onClick ? (
                  <button
                    onClick={() => {
                      link.onClick!();
                      setMenuOpen(false);
                    }}
                    className="font-ovo py-4 block text-gray-800 hover:text-amber-600 transition-colors w-full text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    to={link.href}
                    className="font-ovo py-4 block text-gray-800 hover:text-amber-600 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
