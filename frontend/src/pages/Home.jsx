import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Folder,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import PostCard from "../components/PostCard";
import {
  getCategories,
  getPosts,
} from "../services/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHomeData = async () => {
    setLoading(true);
    setError("");

    try {
      const [postsResponse, categoriesResponse] =
        await Promise.all([
          getPosts({
            skip: 0,
            limit: 50,
          }),
          getCategories(),
        ]);

      setPosts(postsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (requestError) {
      console.error(
        "BLOGNEXUS home data error:",
        requestError,
      );

      setError(
        "Unable to load the latest BLOGNEXUS stories right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const enrichedPosts = useMemo(() => {
    return posts.map((post) => {
      const category = categories.find(
        (item) => item.id === post.category_id,
      );

      return {
        ...post,
        category:
          post.category ||
          post.category_name ||
          category?.name ||
          "GENERAL",
      };
    });
  }, [posts, categories]);

  const featuredPosts = enrichedPosts.slice(0, 3);
  const latestPosts = enrichedPosts.slice(3, 9);

  const visibleLatestPosts =
    latestPosts.length > 0
      ? latestPosts
      : featuredPosts;

  return (
    <div>
      {/* =====================================================
          FEATURED STORIES
      ====================================================== */}
      <section className="mx-auto w-[92%] max-w-7xl pb-24 pt-16 sm:pt-24">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mb-10 flex items-end justify-between gap-6"
        >
          <div>
            <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60">
              <span className="h-px w-8 bg-cyan-400/50" />
              02 // DISCOVER
            </div>

            <motion.h2
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: 0.06,
                ease: "easeOut",
              }}
              className="font-audiowide text-3xl text-white sm:text-4xl"
            >
              FEATURED STORIES
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: 0.14,
                ease: "easeOut",
              }}
              className="mt-3 max-w-xl text-sm leading-7 text-white/40"
            >
              Discover stories published by the BLOGNEXUS community.
            </motion.p>
          </div>

          <Link
            to="/explore"
            className="glitch-hover hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-cyan-300/70 transition-colors duration-[180ms] hover:text-cyan-300 sm:flex"
          >
            VIEW ALL
            <ArrowRight size={13} strokeWidth={1.7} />
          </Link>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
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
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="relative min-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="h-3 w-20 animate-pulse rounded bg-white/[0.06]" />

                <div className="mt-9 h-7 w-[90%] animate-pulse rounded bg-white/[0.06]" />

                <div className="mt-3 h-7 w-[65%] animate-pulse rounded bg-white/[0.06]" />

                <div className="mt-7 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-white/[0.035]" />
                  <div className="h-3 w-[90%] animate-pulse rounded bg-white/[0.035]" />
                  <div className="h-3 w-[75%] animate-pulse rounded bg-white/[0.035]" />
                </div>

                <div className="mt-20 border-t border-white/10 pt-5">
                  <div className="h-2 w-14 animate-pulse rounded bg-white/[0.04]" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded bg-white/[0.05]" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="glow-card relative rounded-2xl border border-red-400/10 bg-red-400/[0.025] p-10 text-center"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-red-300/55">
              HOME_DATA_ERROR
            </div>

            <motion.h3
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.06,
                ease: "easeOut",
              }}
              className="mt-4 font-audiowide text-xl text-white"
            >
              STORIES UNAVAILABLE.
            </motion.h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/30">
              {error}
            </p>

            <button
              type="button"
              onClick={loadHomeData}
              className="glitch-hover premium-button mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 transition-all duration-[180ms] hover:border-cyan-400/25 hover:text-cyan-300"
            >
              <RefreshCw size={13} strokeWidth={1.7} />
              RETRY
            </button>
          </motion.div>
        )}

        {/* Empty */}
        {!loading && !error && featuredPosts.length === 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="glow-card relative rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <FileText
              size={24}
              strokeWidth={1.5}
              className="mx-auto text-cyan-300/30"
            />

            <motion.h3
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.06,
                ease: "easeOut",
              }}
              className="mt-5 font-audiowide text-xl text-white"
            >
              NO STORIES YET.
            </motion.h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/30">
              Be the first to publish an idea on BLOGNEXUS.
            </p>

            <Link
              to="/register"
              className="glitch-hover premium-button mt-7 inline-flex rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-6 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14]"
            >
              START WRITING
            </Link>
          </motion.div>
        )}

        {/* Real featured posts */}
        {!loading && !error && featuredPosts.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                featured
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          LATEST STORIES
      ====================================================== */}
      <section className="mx-auto w-[92%] max-w-7xl pb-24">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mb-10"
        >
          <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60">
            <span className="h-px w-8 bg-cyan-400/50" />
            03 // LATEST
          </div>

          <motion.h2
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              delay: 0.06,
              ease: "easeOut",
            }}
            className="font-audiowide text-3xl text-white sm:text-4xl"
          >
            LATEST STORIES
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              delay: 0.14,
              ease: "easeOut",
            }}
            className="mt-3 max-w-xl text-sm leading-7 text-white/40"
          >
            Fresh perspectives from the BLOGNEXUS community.
          </motion.p>
        </motion.div>

        {!loading &&
          !error &&
          visibleLatestPosts.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleLatestPosts.map((post, index) => (
                <PostCard
                  key={`latest-${post.id}`}
                  post={post}
                  index={index}
                />
              ))}
            </div>
          )}
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}
      <section className="mx-auto w-[92%] max-w-7xl pb-24">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60">
            <span className="h-px w-8 bg-cyan-400/50" />
            04 // EXPLORE
          </div>

          <motion.h2
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              delay: 0.06,
              ease: "easeOut",
            }}
            className="font-audiowide text-3xl text-white sm:text-4xl"
          >
            BROWSE CATEGORIES
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              delay: 0.14,
              ease: "easeOut",
            }}
            className="mt-3 max-w-xl text-sm leading-7 text-white/40"
          >
            Find stories based on what you're interested in.
          </motion.p>

          {!loading && categories.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {categories.slice(0, 5).map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{
                    opacity: 0,
                    y: 30,
                    scale: 0.97,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    to={`/explore?category_id=${category.id}`}
                    className="glow-card group relative block rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-transform duration-[300ms] hover:-translate-y-1"
                  >
                    <span className="card-corner card-corner-tl" />
                    <span className="card-corner card-corner-tr" />
                    <span className="card-corner card-corner-bl" />
                    <span className="card-corner card-corner-br" />

                    <div className="flex items-start justify-between">
                      <div className="font-mono text-[9px] tracking-[0.16em] text-white/25">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <Folder
                        size={15}
                        strokeWidth={1.7}
                        className="text-white/20 transition-colors duration-[180ms] group-hover:text-cyan-300"
                      />
                    </div>

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.08 + 0.06,
                        ease: "easeOut",
                      }}
                      className="mt-6 font-audiowide text-sm text-white/65 transition-colors duration-[180ms] group-hover:text-cyan-300"
                    >
                      {category.name}
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.015] p-8 text-center">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
                NO CATEGORY DATA
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* =====================================================
          COMMUNITY CTA
      ====================================================== */}
      <section className="mx-auto w-[92%] max-w-7xl pb-28">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.035] px-6 py-14 text-center sm:px-12"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-36 w-72 -translate-x-1/2 rounded-full bg-cyan-400/[0.08] blur-3xl" />

          <div className="relative">
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60"
            >
              05 // JOIN THE NETWORK
            </motion.div>

            <motion.h2
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: 0.08,
                ease: "easeOut",
              }}
              className="mx-auto mt-4 max-w-3xl font-audiowide text-3xl leading-tight text-white sm:text-5xl"
            >
              YOUR NEXT IDEA COULD BE SOMEONE'S STARTING POINT.
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: 0.16,
                ease: "easeOut",
              }}
              className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/40"
            >
              Publish your thoughts, build your audience, and become part of
              the BLOGNEXUS community.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: 0.24,
                ease: "easeOut",
              }}
            >
              <Link
                to="/register"
                className="glitch-hover premium-button mt-8 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-7 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14] hover:shadow-[0_0_28px_rgba(34,211,238,0.13)]"
              >
                START WRITING
                <ArrowRight
                  size={14}
                  strokeWidth={1.7}
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;