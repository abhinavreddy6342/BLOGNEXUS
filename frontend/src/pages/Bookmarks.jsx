import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkX,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getMyBookmarks,
  removeBookmark,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

function Bookmarks() {
  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    const loadBookmarks = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getMyBookmarks();
        const data = response.data || [];

        setBookmarks(data);
      } catch (requestError) {
        console.error(
          "BLOGNEXUS bookmarks error:",
          requestError,
        );

        setError(
          "Unable to load your bookmarks. Please make sure the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [authLoading, isAuthenticated]);

  const extractPost = (item) => {
    if (item?.post) {
      return item.post;
    }

    if (item?.blog_post) {
      return item.blog_post;
    }

    return item;
  };

  const handleRemove = async (postId) => {
    if (removingId !== null) {
      return;
    }

    setRemovingId(postId);

    try {
      await removeBookmark(postId);

      setBookmarks((current) =>
        current.filter((item) => {
          const post = extractPost(item);
          return post?.id !== postId;
        }),
      );
    } catch (requestError) {
      console.error(
        "BLOGNEXUS remove bookmark error:",
        requestError,
      );

      setError(
        "Unable to remove this bookmark. Please try again.",
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto flex min-h-screen w-[92%] max-w-7xl items-center justify-center px-6 py-32">
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
            ease: "easeOut",
          }}
          className="text-center"
        >
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-cyan-300/20 border-t-cyan-300" />

          <div className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
            LOADING BOOKMARKS...
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-screen w-[92%] max-w-7xl items-center justify-center px-6 py-32">
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
            ease: "easeOut",
          }}
          className="glow-card relative w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-center backdrop-blur-sm"
        >
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <Bookmark
            size={24}
            strokeWidth={1.5}
            className="mx-auto text-cyan-300/45"
          />

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
              duration: 0.6,
              delay: 0.08,
              ease: "easeOut",
            }}
            className="mt-5 font-audiowide text-2xl text-white"
          >
            SIGN IN REQUIRED.
          </motion.h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/30">
            Sign in to access your saved BLOGNEXUS stories.
          </p>

          <Link
            to="/login"
            className="glitch-hover premium-button mt-7 inline-flex rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14]"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  const posts = bookmarks
    .map(extractPost)
    .filter((post) => post?.id);

  return (
    <div className="mx-auto w-[92%] max-w-7xl pb-28 pt-32 sm:pt-36">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <motion.section
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
          ease: "easeOut",
        }}
      >
        <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60 sm:text-xs">
          <span className="h-px w-8 bg-cyan-400/50" />
          11 // SAVED // COLLECTION
        </div>

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
            duration: 0.6,
            delay: 0.08,
            ease: "easeOut",
          }}
          className="font-audiowide text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          YOUR SAVED
          <br />
          <span className="glitch-hover text-cyan-400">
            STORIES.
          </span>
        </motion.h1>

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
            delay: 0.18,
            ease: "easeOut",
          }}
          className="mt-5 max-w-2xl text-sm leading-7 text-white/35 sm:text-base"
        >
          Keep the stories, ideas, and perspectives you want to return to
          later in one place.
        </motion.p>
      </motion.section>

      {/* =====================================================
          STATS
      ====================================================== */}
      <motion.section
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
          delay: 0.26,
          ease: "easeOut",
        }}
        className="mt-10"
      >
        <div className="glow-card relative inline-flex min-w-[210px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm">
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04]">
            <Bookmark
              size={18}
              strokeWidth={1.7}
              className="text-cyan-300/55"
            />
          </div>

          <div>
            <div className="font-audiowide text-2xl text-white">
              {posts.length}
            </div>

            <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.17em] text-white/25">
              SAVED STORIES
            </div>
          </div>
        </div>
      </motion.section>

      {/* =====================================================
          SECTION HEADER
      ====================================================== */}
      <motion.section
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
        className="mt-16"
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/50">
          12 // COLLECTION
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
          className="mt-2 font-audiowide text-3xl text-white sm:text-4xl"
        >
          BOOKMARKED STORIES.
        </motion.h2>

        <p className="mt-3 text-sm leading-7 text-white/30">
          Your personal reading collection.
        </p>
      </motion.section>

      {/* =====================================================
          ERROR
      ====================================================== */}
      {error && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="mt-6 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-red-300/65"
        >
          {error}
        </motion.div>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}
      {!error && posts.length === 0 && (
        <motion.section
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
            ease: "easeOut",
          }}
          className="glow-card relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center sm:p-16"
        >
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <BookmarkX
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
              delay: 0.08,
              ease: "easeOut",
            }}
            className="mt-5 font-audiowide text-2xl text-white"
          >
            NOTHING SAVED YET.
          </motion.h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/30">
            Bookmark a story while exploring BLOGNEXUS and it will appear
            here.
          </p>

          <Link
            to="/explore"
            className="glitch-hover premium-button mt-7 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-6 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14]"
          >
            <FileText
              size={14}
              strokeWidth={1.7}
            />
            Explore Stories
          </Link>
        </motion.section>
      )}

      {/* =====================================================
          BOOKMARK GRID
      ====================================================== */}
      {posts.length > 0 && (
        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="relative"
            >
              <PostCard
                post={{
                  ...post,
                  category:
                    post.category ||
                    post.category_name ||
                    "GENERAL",
                }}
                index={index}
              />

              <motion.button
                type="button"
                onClick={() => handleRemove(post.id)}
                disabled={removingId === post.id}
                initial={{
                  opacity: 0,
                }}
                whileHover={{
                  opacity: 1,
                }}
                className="absolute right-14 top-5 z-20 rounded-lg border border-white/10 bg-black/70 p-2 text-white/30 backdrop-blur-md transition-all duration-[180ms] hover:border-red-400/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30 md:opacity-0"
                aria-label={`Remove ${post.title} from bookmarks`}
              >
                {removingId === post.id ? (
                  <span className="block h-3.5 w-3.5 animate-spin rounded-full border border-red-300/20 border-t-red-300" />
                ) : (
                  <BookmarkX
                    size={14}
                    strokeWidth={1.7}
                  />
                )}
              </motion.button>

              <Link
                to={`/posts/${post.id}`}
                className="absolute inset-0 z-10"
                aria-label={`Open ${post.title}`}
              />
            </div>
          ))}
        </section>
      )}

      {/* =====================================================
          FOOTER INFO
      ====================================================== */}
      <motion.section
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
        className="mt-20 border-t border-white/10 pt-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
            BLOGNEXUS // READING COLLECTION
          </div>

          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-300/30">
            SAVE · RETURN · DISCOVER
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Bookmarks;