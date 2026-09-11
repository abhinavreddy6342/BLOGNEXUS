import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  LogOut,
  Menu,
  PenLine,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function MainLayout({ children }) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    ["Home", "/"],
    ["Explore", "/explore"],
    ["Categories", "/categories"],
    ["About", "/about"],
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030303] text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[8%] top-[8%] h-72 w-72 rounded-full bg-cyan-400/[0.045] blur-3xl" />
        <div className="absolute right-[4%] top-[28%] h-96 w-96 rounded-full bg-cyan-300/[0.035] blur-3xl" />
        <div className="absolute bottom-[5%] left-[35%] h-80 w-80 rounded-full bg-sky-400/[0.025] blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.25)_100%)]" />
      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-auto mt-4 w-[92%] max-w-7xl rounded-2xl border border-white/10 bg-black/65 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 sm:px-5">
            {/* BRAND */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="group flex items-center"
              aria-label="BLOGNEXUS Home"
            >
              <span className="glitch-hover font-audiowide text-lg tracking-wide text-white sm:text-xl">
                BLOG<span className="text-cyan-400">NEXUS</span>
              </span>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden items-center gap-6 md:flex lg:gap-8">
              {navigation.map(([label, href]) => {
                const active = location.pathname === href;

                return (
                  <Link
                    key={label}
                    to={href}
                    className={`glitch-hover relative font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-[180ms] ${
                      active
                        ? "text-cyan-300"
                        : "text-white/55 hover:text-cyan-300"
                    }`}
                  >
                    {label}

                    {active && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute -bottom-2 left-0 right-0 h-px bg-cyan-400/60"
                        transition={{
                          duration: 0.25,
                          ease: "easeOut",
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* DESKTOP ACTIONS */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/explore"
                className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-white/45 transition-all duration-[180ms] hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-cyan-300 hover:shadow-[0_0_18px_rgba(34,211,238,0.1)]"
                aria-label="Search BLOGNEXUS"
              >
                <Search size={16} strokeWidth={1.7} />
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/bookmarks"
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-white/45 transition-all duration-[180ms] hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-cyan-300 hover:shadow-[0_0_18px_rgba(34,211,238,0.1)]"
                    aria-label="Bookmarks"
                  >
                    <Bookmark size={16} strokeWidth={1.7} />
                  </Link>

                  <Link
                    to="/create-post"
                    className="glitch-hover premium-button flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-cyan-300 hover:bg-cyan-400/[0.14] hover:shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                  >
                    <PenLine size={14} strokeWidth={1.7} />
                    Write
                  </Link>

                  <Link
                    to="/profile"
                    className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 transition-all duration-[180ms] hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
                  >
                    <UserRound
                      size={16}
                      strokeWidth={1.7}
                      className="text-white/40 transition-colors duration-[180ms] group-hover:text-cyan-300"
                    />

                    <span className="max-w-[110px] truncate font-mono text-[9px] uppercase tracking-[0.1em] text-white/45 transition-colors duration-[180ms] group-hover:text-cyan-300">
                      {user?.username || "PROFILE"}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-white/30 transition-all duration-[180ms] hover:border-red-400/20 hover:bg-red-400/[0.04] hover:text-red-300"
                    aria-label="Logout"
                  >
                    <LogOut size={15} strokeWidth={1.7} />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-white/45 transition-all duration-[180ms] hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-cyan-300 hover:shadow-[0_0_18px_rgba(34,211,238,0.1)]"
                    aria-label="Sign in"
                  >
                    <UserRound size={16} strokeWidth={1.7} />
                  </Link>

                  <Link
                    to="/login"
                    className="glitch-hover premium-button rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-cyan-300 hover:bg-cyan-400/[0.14] hover:shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE CONTROLS */}
            <div className="flex items-center gap-2 md:hidden">
              {isAuthenticated && (
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-white/40 transition-colors duration-[180ms] hover:text-cyan-300"
                  aria-label="Profile"
                >
                  <UserRound size={16} strokeWidth={1.7} />
                </Link>
              )}

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen((current) => !current)
                }
                className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-white/45 transition-all duration-[180ms] hover:border-cyan-400/30 hover:text-cyan-300"
                aria-label={
                  mobileMenuOpen
                    ? "Close menu"
                    : "Open menu"
                }
              >
                {mobileMenuOpen ? (
                  <X size={17} strokeWidth={1.7} />
                ) : (
                  <Menu size={17} strokeWidth={1.7} />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="overflow-hidden border-t border-white/10 md:hidden"
              >
                <div className="space-y-2 px-4 py-4">
                  {navigation.map(([label, href], index) => {
                    const active = location.pathname === href;

                    return (
                      <motion.div
                        key={label}
                        initial={{
                          opacity: 0,
                          y: 12,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.45,
                          delay: index * 0.06,
                          ease: "easeOut",
                        }}
                      >
                        <Link
                          to={href}
                          onClick={closeMobileMenu}
                          className={`glitch-hover block rounded-xl border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-[180ms] ${
                            active
                              ? "border-cyan-400/20 bg-cyan-400/[0.05] text-cyan-300"
                              : "border-white/10 bg-white/[0.015] text-white/45 hover:border-cyan-400/20 hover:text-cyan-300"
                          }`}
                        >
                          {label}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/create-post"
                        onClick={closeMobileMenu}
                        className="glitch-hover flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300"
                      >
                        <PenLine size={14} strokeWidth={1.7} />
                        Write a Story
                      </Link>

                      <Link
                        to="/bookmarks"
                        onClick={closeMobileMenu}
                        className="glitch-hover flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.015] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45"
                      >
                        <Bookmark size={14} strokeWidth={1.7} />
                        Bookmarks
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.015] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 transition-colors duration-[180ms] hover:border-red-400/20 hover:text-red-300"
                      >
                        <LogOut size={14} strokeWidth={1.7} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="glitch-hover flex items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300"
                      >
                        Sign In
                      </Link>

                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className="glitch-hover flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}
      <main className="relative z-10">{children}</main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="relative z-10 mx-auto mt-10 w-[92%] max-w-7xl border-t border-white/10 py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/"
              className="glitch-hover font-audiowide text-sm tracking-wide text-white/75"
            >
              BLOG<span className="text-cyan-400">NEXUS</span>
            </Link>

            <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
              Modern Blogging Network // 01
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/about"
              className="glitch-hover rounded-lg border border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40 transition-all duration-[180ms] hover:border-cyan-400/30 hover:text-cyan-300"
            >
              About
            </Link>

            <span className="font-mono text-[9px] text-white/15">
              © 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;