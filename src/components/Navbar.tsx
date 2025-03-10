"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext"; 


export function Navbar() {
  const { user, signIn,signOut } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          scrolled
            ? "glass border-b border-white/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gradient">
                Envisionix
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-1">
            <NavLink href="/" active>
              Home
            </NavLink>
            <NavLink href="/gallery">
              Gallery
            </NavLink>
            <NavLink href="/remix">
              Remix
            </NavLink>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 rounded-xl glass-button text-white text-sm"
              >
                Sign Out
              </button>
            ) : (
              <>
                <button 
                  onClick={signIn} 
                  className="px-4 py-2 rounded-xl glass-input hover:bg-white/10 transition-colors text-sm"
                >
                  Sign In
                </button>
                <button 
                  onClick={signIn} 
                  className="px-4 py-2 rounded-xl glass-button text-white text-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-current hover:bg-white/10 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: mobileMenuOpen ? 1 : 0,
          height: mobileMenuOpen ? "auto" : 0
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden glass border-b border-white/10 overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink href="/" active>
            Home
          </MobileNavLink>
          <MobileNavLink href="/gallery">
            Gallery
          </MobileNavLink>
          <MobileNavLink href="/about">
            About
          </MobileNavLink>
          <MobileNavLink href="/pricing">
            Pricing
          </MobileNavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-white/10">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium">Guest User</div>
              <div className="text-sm opacity-60">Sign in to save images</div>
            </div>
          </div>
          <div className="mt-3 px-2 space-y-1">
            <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors">
              Sign In
            </button>
            <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </motion.div>
    </header>
  );
}

// Desktop navigation link component
function NavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors relative ${
        active
          ? "text-white"
          : "hover:bg-white/10"
      }`}
    >
      {children}
      {active && (
        <motion.span 
          layoutId="activeNavIndicator"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-teal-400"
        ></motion.span>
      )}
    </Link>
  );
}

// Mobile navigation link component
function MobileNavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        active
          ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white"
          : "hover:bg-white/10"
      }`}
    >
      {children}
    </Link>
  );
}