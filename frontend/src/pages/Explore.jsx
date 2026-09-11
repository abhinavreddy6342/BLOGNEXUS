import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

import PostCard from "../components/PostCard";
import {
  getCategories,
  getPosts,
} from "../services/api";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch {
        setCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          skip: 0,
          limit: 50,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (selectedCategory) {
          params.category_id = Number(selectedCategory);
        }

        const response = await getPosts(params);

        setPosts(response.data || []);
      } catch (requestError) {
        console.error("Explore posts error:", requestError);

        setPosts([]);
        setError(
          "Unable to load stories right now. Make sure the BLOGNEXUS backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      loadPosts();
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, selectedCategory]);

  const normalizedPosts = useMemo(() => {
    return posts.map((post) => {
      const matchingCategory = categories.find(
        (category) => category.id === post.category_id,
      );

      return {
        ...post,
        category:
          post.category ||
          matchingCategory?.name ||
          "GENERAL",
      };
    });
  }, [posts, categories]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
  };

  const hasFilters =
    search.trim().length > 0 || selectedCategory !== "";

  return (
    <div className="mx-auto w-[92%] max-w-7xl pb-28 pt-32 sm:pt-36">
      {/* HEADER */}
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
          02 // EXPLORE // DISCOVER
        </div>

        <h1 className="font-audiowide text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
          DISCOVER
          <br />
          <span className="glitch-hover text-cyan-400">
            NEW STORIES.
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
          Explore ideas, technical insights, experiences, and perspectives
          shared across the BLOGNEXUS community.
        </p>
      </motion.section>

      {/* SEARCH / FILTER */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.16,
          ease: "easeOut",
        }}
        className="mt-10"
      >
        <div className="glow-card relative rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-sm sm:p-5">
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            {/* SEARCH */}
            <div className="relative">
              <Search
                size={17}
                strokeWidth={1.7}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search stories, topics, ideas..."
                className="w-full rounded-xl border border-white/10 bg-black/30 py-3.5 pl-11 pr-11 text-sm text-white outline-none transition-all duration-[180ms] placeholder:text-white/20 focus:border-cyan-400/30 focus:bg-cyan-400/[0.025] focus:shadow-[0_0_24px_rgba(34,211,238,0.06)]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/25 transition-colors duration-[180ms] hover:text-cyan-300"
                  aria-label="Clear search"
                >
                  <X size={15} strokeWidth={1.7} />
                </button>
              )}
            </div>

            {/* CATEGORY */}
            <div className="relative min-w-0 lg:min-w-[240px]">
              <SlidersHorizontal
                size={15}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
              />

              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                disabled={categoryLoading}
                className="w-full appearance-none rounded-xl border border-white/10 bg-black/30 py-3.5 pl-10 pr-4 text-sm text-white/60 outline-none transition-all duration-[180ms] focus:border-cyan-400/30 focus:bg-cyan-400/[0.025] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <option value="" className="bg-[#090909]">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    className="bg-[#090909]"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ACTIVE FILTERS */}
          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/20">
                ACTIVE_FILTERS
              </span>

              {search && (
                <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] px-2.5 py-1.5 font-mono text-[9px] text-cyan-300/80">
                  SEARCH: {search}
                </span>
              )}

              {selectedCategory && (
                <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] px-2.5 py-1.5 font-mono text-[9px] text-cyan-300/80">
                  CATEGORY:{" "}
                  {categories.find(
                    (category) =>
                      String(category.id) === selectedCategory,
                  )?.name || selectedCategory}
                </span>
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="glitch-hover ml-auto font-mono text-[9px] uppercase tracking-[0.15em] text-white/30 transition-colors duration-[180ms] hover:text-cyan-300"
              >
                CLEAR ALL
              </button>
            </div>
          )}
        </div>
      </motion.section>

      {/* RESULT HEADER */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          delay: 0.25,
          ease: "easeOut",
        }}
        className="mt-14 flex items-end justify-between gap-5"
      >
        <div>
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-300/50">
            03 // RESULTS
          </div>

          <h2 className="font-audiowide text-2xl text-white sm:text-3xl">
            {hasFilters ? "Filtered Stories" : "All Stories"}
          </h2>
        </div>

        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/20">
          {loading ? "SCANNING..." : `${posts.length} STORIES`}
        </div>
      </motion.section>

      {/* CONTENT */}
      <section className="mt-8">
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="relative min-h-[350px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-cyan-400/[0.025]" />

                <div className="relative p-6">
                  <div className="h-3 w-20 animate-pulse rounded bg-white/[0.06]" />

                  <div className="mt-8 h-7 w-[85%] animate-pulse rounded bg-white/[0.06]" />

                  <div className="mt-3 h-7 w-[65%] animate-pulse rounded bg-white/[0.06]" />

                  <div className="mt-6 space-y-2">
                    <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
                    <div className="h-3 w-[90%] animate-pulse rounded bg-white/[0.04]" />
                    <div className="h-3 w-[75%] animate-pulse rounded bg-white/[0.04]" />
                  </div>

                  <div className="mt-16 border-t border-white/10 pt-5">
                    <div className="h-2 w-14 animate-pulse rounded bg-white/[0.04]" />
                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-white/[0.05]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
            }}
            className="glow-card relative rounded-2xl border border-red-400/10 bg-red-400/[0.025] p-10 text-center"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-red-300/50">
              ERROR // CONNECTION
            </div>

            <h3 className="mt-4 font-audiowide text-xl text-white">
              Unable to reach BLOGNEXUS
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/35">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="glitch-hover premium-button mt-7 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/55 hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
            >
              Retry Connection
            </button>
          </motion.div>
        ) : normalizedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
            }}
            className="glow-card relative rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center sm:p-16"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/45">
              404 // NO STORIES FOUND
            </div>

            <h3 className="mt-4 font-audiowide text-2xl text-white">
              Nothing here yet.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/35">
              Try a different search term or explore another category.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="glitch-hover premium-button mt-7 rounded-xl border border-cyan-400/25 bg-cyan-400/[0.06] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.1] hover:shadow-[0_0_24px_rgba(34,211,238,0.1)]"
              >
                Reset Filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {normalizedPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* BOTTOM INFO */}
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
            BLOGNEXUS // DISCOVERY ENGINE
          </div>

          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-300/30">
            STORIES · IDEAS · COMMUNITY
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Explore;