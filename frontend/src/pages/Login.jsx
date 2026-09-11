import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectPath = location.state?.from || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      console.error("BLOGNEXUS login error:", requestError);

      const detail = requestError?.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Login failed. Please check your credentials and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pt-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-cyan-400/[0.045] blur-3xl" />
        <div className="absolute right-[8%] top-[30%] h-80 w-80 rounded-full bg-cyan-300/[0.035] blur-3xl" />
        <div className="absolute bottom-[8%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-400/[0.025] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] w-[92%] max-w-7xl items-center justify-center pb-20">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_0_80px_rgba(34,211,238,0.035)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left panel */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="hidden border-r border-white/10 bg-cyan-400/[0.015] p-10 lg:flex lg:flex-col lg:justify-between lg:p-12"
          >
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/55">
                <span className="h-px w-8 bg-cyan-400/50" />
                05 // AUTHENTICATION
              </div>

              <h2 className="mt-8 font-audiowide text-4xl leading-tight text-white">
                WELCOME
                <br />
                <span className="glitch-hover text-cyan-400">
                  BACK.
                </span>
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-white/35">
                Sign in to continue exploring stories, publishing ideas,
                connecting with creators, and building your presence on
                BLOGNEXUS.
              </p>
            </div>

            <div className="space-y-4">
              {[
                ["01", "DISCOVER", "Find ideas worth your attention."],
                ["02", "CREATE", "Publish your perspective."],
                ["03", "CONNECT", "Build meaningful conversations."],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="flex gap-4 border-t border-white/10 pt-4"
                >
                  <div className="font-mono text-[9px] text-cyan-300/35">
                    {number}
                  </div>

                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">
                      {title}
                    </div>

                    <div className="mt-1 text-xs leading-5 text-white/25">
                      {description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Login panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.08,
              ease: "easeOut",
            }}
            className="glow-card relative p-7 sm:p-10 lg:p-12"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <div className="lg:hidden">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/55">
                05 // AUTHENTICATION
              </div>
            </div>

            <div className="mt-2 lg:mt-0">
              <h1 className="font-audiowide text-3xl text-white sm:text-4xl">
                SIGN IN
              </h1>

              <p className="mt-3 text-sm leading-6 text-white/35">
                Access your BLOGNEXUS account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-9 space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/35"
                >
                  EMAIL ADDRESS
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    strokeWidth={1.7}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-black/30 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-[180ms] placeholder:text-white/15 focus:border-cyan-400/30 focus:bg-cyan-400/[0.02] focus:shadow-[0_0_24px_rgba(34,211,238,0.055)]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35"
                  >
                    PASSWORD
                  </label>

                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/15">
                    SECURE ACCESS
                  </span>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={16}
                    strokeWidth={1.7}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-black/30 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition-all duration-[180ms] placeholder:text-white/15 focus:border-cyan-400/30 focus:bg-cyan-400/[0.02] focus:shadow-[0_0_24px_rgba(34,211,238,0.055)]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/20 transition-colors duration-[180ms] hover:text-cyan-300"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={15} strokeWidth={1.7} />
                    ) : (
                      <Eye size={15} strokeWidth={1.7} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3"
                >
                  <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-red-300/65">
                    ACCESS_ERROR
                  </div>

                  <div className="mt-1 text-xs leading-5 text-red-200/50">
                    {error}
                  </div>
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={
                  loading
                    ? {}
                    : {
                        y: -2,
                        scale: 1.01,
                      }
                }
                transition={{
                  duration: 0.18,
                  ease: "easeOut",
                }}
                className="glitch-hover premium-button flex w-full items-center justify-center gap-3 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.17em] text-cyan-300 hover:bg-cyan-400/[0.14] hover:shadow-[0_0_28px_rgba(34,211,238,0.13)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border border-cyan-300/30 border-t-cyan-300" />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    ENTER BLOGNEXUS
                    <ArrowRight
                      size={15}
                      strokeWidth={1.7}
                    />
                  </>
                )}
              </motion.button>
            </form>

            {/* Security note */}
            <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
              <ShieldCheck
                size={15}
                strokeWidth={1.7}
                className="text-cyan-300/35"
              />

              <p className="font-mono text-[8px] uppercase leading-4 tracking-[0.12em] text-white/20">
                AUTHENTICATED CONNECTION // BLOGNEXUS
              </p>
            </div>

            {/* Register */}
            <div className="mt-7 text-center">
              <span className="text-xs text-white/25">
                Don't have an account?
              </span>{" "}
              <Link
                to="/register"
                className="glitch-hover font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-300/70 transition-colors duration-[180ms] hover:text-cyan-300"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;