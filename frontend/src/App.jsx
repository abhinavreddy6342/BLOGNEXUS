import { motion } from "framer-motion";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Snowfall from "./components/Snowfall";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyPosts from "./pages/MyPosts";
import Bookmarks from "./pages/Bookmarks";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost";

const stats = [
  ["01", "AUTHORS"],
  ["∞", "IDEAS"],
  ["05", "CATEGORIES"],
  ["24/7", "COMMUNITY"],
];

function HomePage() {
  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative flex min-h-screen items-center px-6 pb-24 pt-32 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-5xl">
            {/* Technical label */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.05,
                ease: "easeOut",
              }}
              className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/65 sm:text-xs"
            >
              <span className="h-px w-8 bg-cyan-400/50" />

              <span>
                01 // COMMUNITY // STORIES // IDEAS
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                delay: 0.1,
                ease: "easeOut",
              }}
              className="font-audiowide text-5xl leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-8xl"
            >
              YOUR IDEAS
              <br />

              <span className="glitch-hover inline-block text-cyan-400">
                BELONG HERE.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.22,
                ease: "easeOut",
              }}
              className="mt-7 max-w-2xl text-base leading-8 text-white/50 sm:text-lg"
            >
              BLOGNEXUS is a modern space for writers, developers, creators,
              and thinkers to publish ideas, discover perspectives, and build
              meaningful connections.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.34,
                ease: "easeOut",
              }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <motion.a
                href="/explore"
                whileHover={{
                  y: -2,
                  scale: 1.015,
                }}
                transition={{
                  duration: 0.18,
                  ease: "easeOut",
                }}
                className="glitch-hover premium-button rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14] hover:shadow-[0_0_30px_rgba(34,211,238,0.16)] sm:text-xs"
              >
                Explore Stories
              </motion.a>

              <motion.a
                href="/register"
                whileHover={{
                  y: -2,
                  scale: 1.015,
                }}
                transition={{
                  duration: 0.18,
                  ease: "easeOut",
                }}
                className="glitch-hover premium-button rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/65 hover:border-white/20 hover:bg-white/[0.05] hover:text-white sm:text-xs"
              >
                Start Writing
              </motion.a>
            </motion.div>
          </div>

          {/* =================================================
              STATS
          ================================================== */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.48,
              ease: "easeOut",
            }}
            className="mt-20 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {stats.map(([value, label], index) => (
              <motion.div
                key={label}
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.52 + index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -4,
                }}
                className="glow-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm"
              >
                <span className="card-corner card-corner-tl" />
                <span className="card-corner card-corner-tr" />
                <span className="card-corner card-corner-bl" />
                <span className="card-corner card-corner-br" />

                <div className="font-audiowide text-xl text-white transition-colors duration-[180ms] group-hover:text-cyan-300">
                  {value}
                </div>

                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30 transition-colors duration-[180ms] group-hover:text-white/55">
                  {label}
                </div>

                <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cyan-400/70 transition-transform duration-300 group-hover:scale-x-100" />
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.9,
              ease: "easeOut",
            }}
            className="mt-16 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/20"
          >
            <span className="h-px w-10 bg-white/10" />
            SCROLL TO DISCOVER
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          HOME CONTENT
      ====================================================== */}
      <Home />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Snowfall />

        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* USER */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/bookmarks" element={<Bookmarks />} />

          {/* CREATE */}
          <Route path="/create-post" element={<CreatePost />} />

          {/* POST */}
          <Route
            path="/posts/:postId"
            element={<PostDetails />}
          />

          {/* EDIT POST */}
          <Route
            path="/posts/:postId/edit"
            element={<EditPost />}
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;