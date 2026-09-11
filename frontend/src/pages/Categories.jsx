import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Folder,
  Layers3,
  Sparkles,
} from "lucide-react";

import { getCategories, getPosts } from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError("");

      try {
        const [categoriesResponse, postsResponse] = await Promise.all([
          getCategories(),
          getPosts({
            skip: 0,
            limit: 100,
          }),
        ]);

        const categoryData = categoriesResponse.data || [];
        const postsData = postsResponse.data || [];

        setCategories(categoryData);

        const counts = {};

        postsData.forEach((post) => {
          if (post.category_id !== null && post.category_id !== undefined) {
            counts[post.category_id] =
              (counts[post.category_id] || 0) + 1;
          }
        });

        setCategoryCounts(counts);
      } catch (requestError) {
        console.error("BLOGNEXUS categories error:", requestError);

        setError(
          "Unable to load categories. Please make sure the BLOGNEXUS backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="mx-auto w-[92%] max-w-7xl pb-28 pt-32 sm:pt-36">
      {/* =====================================================
          HERO
      ====================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.65,
          ease: "easeOut",
        }}
      >
        <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60 sm:text-xs">
          <span className="h-px w-8 bg-cyan-400/50" />
          03 // CATEGORIES // INDEX
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            delay: 0.08,
            ease: "easeOut",
          }}
          className="font-audiowide text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          EXPLORE BY
          <br />
          <span className="glitch-hover text-cyan-400">
            CATEGORY.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base"
        >
          Navigate the BLOGNEXUS knowledge network by topic and discover
          stories that match your interests.
        </motion.p>
      </motion.section>

      {/* =====================================================
          CATEGORY STATS
      ====================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          ease: "easeOut",
        }}
        className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        <div className="glow-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm">
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <Folder
            size={17}
            strokeWidth={1.7}
            className="text-cyan-300/55"
          />

          <div className="mt-4 font-audiowide text-2xl text-white sm:text-3xl">
            {loading ? "—" : categories.length}
          </div>

          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
            CATEGORIES
          </div>
        </div>

        <div className="glow-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm">
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <Layers3
            size={17}
            strokeWidth={1.7}
            className="text-cyan-300/55"
          />

          <div className="mt-4 font-audiowide text-2xl text-white sm:text-3xl">
            {loading
              ? "—"
              : Object.values(categoryCounts).reduce(
                  (sum, count) => sum + count,
                  0,
                )}
          </div>

          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
            CLASSIFIED STORIES
          </div>
        </div>

        <div className="glow-card relative col-span-2 overflow-hidden rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.025] p-5 backdrop-blur-sm sm:col-span-1">
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <Sparkles
            size={17}
            strokeWidth={1.7}
            className="text-cyan-300/55"
          />

          <div className="mt-4 font-audiowide text-2xl text-white sm:text-3xl">
            ∞
          </div>

          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
            IDEAS IN MOTION
          </div>
        </div>
      </motion.section>

      {/* =====================================================
          SECTION HEADING
      ====================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.4,
          ease: "easeOut",
        }}
        className="mt-16"
      >
        <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-300/50">
          04 // KNOWLEDGE MAP
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.46,
            ease: "easeOut",
          }}
          className="font-audiowide text-2xl text-white sm:text-3xl"
        >
          BROWSE TOPICS
        </motion.h2>

        <p className="mt-3 max-w-xl text-sm leading-7 text-white/35">
          Choose a category to focus your discovery on a specific area of
          knowledge.
        </p>
      </motion.section>

      {/* =====================================================
          LOADING
      ====================================================== */}
      {loading && (
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="relative min-h-[230px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="h-9 w-9 animate-pulse rounded-xl bg-white/[0.06]" />

              <div className="mt-8 h-5 w-36 animate-pulse rounded bg-white/[0.06]" />

              <div className="mt-3 h-3 w-24 animate-pulse rounded bg-white/[0.04]" />

              <div className="mt-8 h-2 w-full animate-pulse rounded bg-white/[0.035]" />
            </motion.div>
          ))}
        </section>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}
      {!loading && error && (
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: "easeOut",
          }}
          className="glow-card relative mt-8 rounded-2xl border border-red-400/10 bg-red-400/[0.025] p-10 text-center"
        >
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-red-300/50">
            ERROR // CATEGORY SYSTEM
          </div>

          <h3 className="mt-4 font-audiowide text-xl text-white">
            CATEGORY DATA UNAVAILABLE
          </h3>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/35">
            {error}
          </p>
        </motion.section>
      )}

      {/* =====================================================
          EMPTY
      ====================================================== */}
      {!loading && !error && categories.length === 0 && (
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: "easeOut",
          }}
          className="glow-card relative mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center"
        >
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/45">
            404 // EMPTY INDEX
          </div>

          <h3 className="mt-4 font-audiowide text-2xl text-white">
            NO CATEGORIES FOUND.
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/35">
            The BLOGNEXUS category network is currently empty.
          </p>
        </motion.section>
      )}

      {/* =====================================================
          CATEGORY GRID
      ====================================================== */}
      {!loading && !error && categories.length > 0 && (
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const postCount = categoryCounts[category.id] || 0;

            return (
              <motion.a
                key={category.id}
                href={`/explore?category_id=${category.id}`}
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
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -5,
                }}
                className="glow-card group relative min-h-[230px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-sm"
              >
                <span className="card-corner card-corner-tl" />
                <span className="card-corner card-corner-tr" />
                <span className="card-corner card-corner-bl" />
                <span className="card-corner card-corner-br" />

                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] text-white/35 transition-all duration-[180ms] group-hover:border-cyan-400/25 group-hover:bg-cyan-400/[0.05] group-hover:text-cyan-300">
                    <Folder
                      size={18}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div className="font-mono text-[9px] tracking-[0.16em] text-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="mt-8">
                  <motion.h3
                    initial={false}
                    className="font-audiowide text-xl leading-tight text-white transition-colors duration-[180ms] group-hover:text-cyan-300"
                  >
                    {category.name}
                  </motion.h3>

                  <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/20">
                    {postCount}{" "}
                    {postCount === 1 ? "STORY" : "STORIES"}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300/35 transition-colors duration-[180ms] group-hover:text-cyan-300/70">
                    EXPLORE TOPIC
                  </span>

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.7}
                    className="text-white/20 transition-all duration-[180ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cyan-400/70 transition-transform duration-300 group-hover:scale-x-100" />
              </motion.a>
            );
          })}
        </section>
      )}

      {/* =====================================================
          FOOTER INFO
      ====================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className="mt-20 border-t border-white/10 pt-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
            BLOGNEXUS // CATEGORY NETWORK
          </div>

          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-300/30">
            DISCOVER · LEARN · CREATE
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Categories;