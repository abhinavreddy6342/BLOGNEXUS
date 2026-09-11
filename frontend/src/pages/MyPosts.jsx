import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Edit3,
  FileText,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { deletePost, getPosts } from "../services/api";
import { useAuth } from "../context/AuthContext";

function MyPosts() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    const loadMyPosts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getPosts({
          skip: 0,
          limit: 100,
        });

        const allPosts = response.data || [];

        const mine = allPosts.filter(
          (post) => Number(post.author_id) === Number(user?.id),
        );

        setPosts(mine);
      } catch (requestError) {
        console.error("BLOGNEXUS my posts error:", requestError);

        setError(
          "Unable to load your stories. Please make sure the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyPosts();
  }, [authLoading, isAuthenticated, user]);

  const handleDelete = async (postId) => {
    if (deletingId !== null) {
      return;
    }

    setDeletingId(postId);
    setDeleteError("");

    try {
      await deletePost(postId);

      setPosts((current) =>
        current.filter((post) => post.id !== postId),
      );

      setConfirmDeleteId(null);
    } catch (requestError) {
      console.error("BLOGNEXUS delete post error:", requestError);

      const detail = requestError?.response?.data?.detail;

      if (typeof detail === "string") {
        setDeleteError(detail);
      } else {
        setDeleteError(
          "Unable to delete this story. Please try again.",
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto flex min-h-screen w-[92%] max-w-7xl items-center justify-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="text-center"
        >
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-cyan-300/20 border-t-cyan-300" />

          <div className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
            LOADING YOUR STORIES...
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-screen w-[92%] max-w-7xl items-center justify-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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

          <FileText
            size={24}
            strokeWidth={1.5}
            className="mx-auto text-cyan-300/45"
          />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
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
            Sign in to manage your published BLOGNEXUS stories.
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

  return (
    <div className="mx-auto w-[92%] max-w-7xl pb-28 pt-32 sm:pt-36">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60 sm:text-xs">
          <span className="h-px w-8 bg-cyan-400/50" />
          12 // AUTHOR // STORIES
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.08,
                ease: "easeOut",
              }}
              className="font-audiowide text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              MY
              <br />
              <span className="glitch-hover text-cyan-400">
                STORIES.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.18,
                ease: "easeOut",
              }}
              className="mt-4 max-w-xl text-sm leading-7 text-white/35 sm:text-base"
            >
              Manage everything you've published to the BLOGNEXUS community.
            </motion.p>
          </div>

          <Link
            to="/create-post"
            className="glitch-hover premium-button inline-flex items-center justify-center gap-2 self-start rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14] hover:shadow-[0_0_26px_rgba(34,211,238,0.12)] sm:self-auto"
          >
            <Plus size={15} strokeWidth={1.7} />
            NEW STORY
          </Link>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.25,
          ease: "easeOut",
        }}
        className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {[
          ["01", posts.length, "PUBLISHED"],
          ["02", "LIVE", "STATUS"],
          ["03", "∞", "IDEAS"],
        ].map(([number, value, label], index) => (
          <motion.div
            key={label}
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3 + index * 0.08,
              ease: "easeOut",
            }}
            whileHover={{ y: -4 }}
            className="glow-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <div className="font-mono text-[8px] tracking-[0.16em] text-cyan-300/35">
              {number}
            </div>

            <div className="mt-5 font-audiowide text-2xl text-white sm:text-3xl">
              {value}
            </div>

            <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.17em] text-white/25">
              {label}
            </div>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
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
          13 // CONTENT MANAGEMENT
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
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
          YOUR PUBLISHED WORK.
        </motion.h2>
      </motion.section>

      {deleteError && (
        <div className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-red-300/65">
          {deleteError}
        </div>
      )}

      {!error && posts.length === 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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

          <FileText
            size={24}
            strokeWidth={1.5}
            className="mx-auto text-cyan-300/30"
          />

          <motion.h3
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.08,
              ease: "easeOut",
            }}
            className="mt-5 font-audiowide text-2xl text-white"
          >
            YOUR STORY STARTS HERE.
          </motion.h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/30">
            You haven't published anything yet.
          </p>

          <Link
            to="/create-post"
            className="glitch-hover premium-button mt-7 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-6 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14]"
          >
            <Plus size={14} strokeWidth={1.7} />
            CREATE STORY
          </Link>
        </motion.section>
      )}

      {posts.length > 0 && (
        <div className="mt-8 space-y-5">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
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
                amount: 0.12,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="glow-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-sm"
            >
              <span className="card-corner card-corner-tl" />
              <span className="card-corner card-corner-tr" />
              <span className="card-corner card-corner-bl" />
              <span className="card-corner card-corner-br" />

              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[8px] uppercase tracking-[0.17em] text-cyan-300/55">
                      {post.category || "GENERAL"}
                    </span>

                    <span className="font-mono text-[8px] tracking-[0.14em] text-white/15">
                      POST_{String(post.id).padStart(3, "0")}
                    </span>
                  </div>

                  <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-cyan-300/40">
                    PUBLISHED
                  </span>
                </div>

                <motion.h3
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08 + 0.06,
                    ease: "easeOut",
                  }}
                  className="mt-5 font-audiowide text-xl leading-tight text-white transition-colors duration-[180ms] group-hover:text-cyan-300 sm:text-2xl"
                >
                  {post.title}
                </motion.h3>

                <p className="mt-3 line-clamp-3 max-w-4xl text-sm leading-7 text-white/30">
                  {post.content}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-5 font-mono text-[8px] uppercase tracking-[0.12em] text-white/20">
                  <span>{post.likes ?? 0} LIKES</span>
                  <span>{post.comments ?? 0} COMMENTS</span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                  <Link
                    to={`/posts/${post.id}`}
                    className="glitch-hover premium-button inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45 hover:border-cyan-400/25 hover:text-cyan-300"
                  >
                    <ArrowUpRight size={14} strokeWidth={1.7} />
                    VIEW
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/posts/${post.id}/edit`)
                    }
                    className="glitch-hover premium-button inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45 hover:border-cyan-400/25 hover:text-cyan-300"
                  >
                    <Edit3 size={14} strokeWidth={1.7} />
                    EDIT
                  </button>

                  {/* ALWAYS VISIBLE DELETE */}
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmDeleteId(post.id)
                    }
                    className="glitch-hover premium-button inline-flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-400/[0.04] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-red-300/80 transition-all duration-[180ms] hover:border-red-400/45 hover:bg-red-400/[0.09] hover:text-red-300"
                  >
                    <Trash2 size={14} strokeWidth={1.7} />
                    DELETE STORY
                  </button>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cyan-400/70 transition-transform duration-300 group-hover:scale-x-100" />
            </motion.article>
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      {confirmDeleteId !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-5 backdrop-blur-md"
          onClick={() => setConfirmDeleteId(null)}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="relative w-full max-w-md rounded-2xl border border-red-400/20 bg-[#080808] p-7 shadow-[0_0_60px_rgba(239,68,68,0.08)]"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-red-300/60">
                  14 // DELETE
                </div>

                <motion.h2
                  initial={{
                    opacity: 0,
                    y: 20,
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
                  className="mt-3 font-audiowide text-2xl text-white"
                >
                  DELETE STORY?
                </motion.h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setConfirmDeleteId(null)
                }
                className="rounded-lg p-2 text-white/25 transition-colors duration-[180ms] hover:text-white/70"
                aria-label="Close"
              >
                <X size={17} strokeWidth={1.7} />
              </button>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/35">
              This will permanently remove this story from BLOGNEXUS.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setConfirmDeleteId(null)
                }
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 transition-colors duration-[180ms] hover:text-white/70"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(confirmDeleteId)
                }
                disabled={deletingId !== null}
                className="flex-1 rounded-xl border border-red-400/30 bg-red-400/[0.07] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-red-300 transition-all duration-[180ms] hover:border-red-400/50 hover:bg-red-400/[0.12] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deletingId !== null
                  ? "DELETING..."
                  : "DELETE STORY"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default MyPosts; 