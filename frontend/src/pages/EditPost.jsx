import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Save,
  Tag,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getCategories,
  getPost,
  updatePost,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    if (!postId) {
      setLoading(false);
      setError("Invalid post ID.");
      return;
    }

    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const postResponse = await getPost(postId);

        if (!mounted) {
          return;
        }

        const post = postResponse?.data;

        if (!post) {
          setError("Story not found.");
          return;
        }

        /*
         * Compare IDs as numbers so string/number differences
         * cannot incorrectly block the owner from editing.
         */
        const postAuthorId = Number(post.author_id);
        const currentUserId = Number(user?.id);

        if (
          Number.isFinite(currentUserId) &&
          Number.isFinite(postAuthorId) &&
          postAuthorId !== currentUserId
        ) {
          setError(
            "You can only edit stories published from your account.",
          );
          return;
        }

        setForm({
          title: post.title || "",
          content: post.content || "",
          category_id:
            post.category_id !== null &&
            post.category_id !== undefined
              ? String(post.category_id)
              : "",
        });

        /*
         * Categories are secondary data. Even if category loading
         * fails, the existing post can still be edited.
         */
        try {
          const categoriesResponse = await getCategories();

          if (mounted) {
            setCategories(categoriesResponse?.data || []);
          }
        } catch (categoryError) {
          console.error(
            "BLOGNEXUS category loading error:",
            categoryError,
          );

          if (mounted) {
            setCategories([]);
          }
        }
      } catch (requestError) {
        console.error(
          "BLOGNEXUS edit post load error:",
          requestError,
        );

        const status = requestError?.response?.status;
        const detail = requestError?.response?.data?.detail;

        if (status === 401) {
          setError(
            "Your session has expired. Please sign in again.",
          );
        } else if (status === 403) {
          setError(
            "You do not have permission to edit this story.",
          );
        } else if (status === 404) {
          setError("Story not found.");
        } else if (typeof detail === "string") {
          setError(detail);
        } else {
          setError(
            "Unable to load this story for editing.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [
    postId,
    authLoading,
    isAuthenticated,
    user?.id,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const content = form.content.trim();

    if (!title) {
      setError("Please enter a story title.");
      return;
    }

    if (title.length < 3) {
      setError(
        "Your title should contain at least 3 characters.",
      );
      return;
    }

    if (!content) {
      setError("Story content cannot be empty.");
      return;
    }

    if (content.length < 10) {
      setError(
        "Your story should contain at least 10 characters.",
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title,
        content,
        category_id: form.category_id
          ? Number(form.category_id)
          : null,
      };

      const response = await updatePost(
        Number(postId),
        payload,
      );

      const updatedPost = response?.data;

      setSuccess("STORY UPDATED SUCCESSFULLY.");

      /*
       * Small delay lets the success state render before navigation.
       */
      setTimeout(() => {
        if (updatedPost?.id) {
          navigate(`/posts/${updatedPost.id}`);
        } else {
          navigate(`/posts/${postId}`);
        }
      }, 450);
    } catch (requestError) {
      console.error(
        "BLOGNEXUS update post error:",
        requestError,
      );

      const status = requestError?.response?.status;
      const detail = requestError?.response?.data?.detail;

      if (status === 401) {
        setError(
          "Your session has expired. Please sign in again.",
        );
      } else if (status === 403) {
        setError(
          "You can only edit your own stories.",
        );
      } else if (status === 404) {
        setError("This story no longer exists.");
      } else if (status === 422) {
        if (Array.isArray(detail) && detail.length > 0) {
          setError(
            detail
              .map((item) => item?.msg)
              .filter(Boolean)
              .join(" • ") ||
              "Some fields are invalid.",
          );
        } else {
          setError(
            "Please check the title, content, and category.",
          );
        }
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Unable to update your story. Please try again.",
        );
      }
    } finally {
      setSaving(false);
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
            LOADING STORY...
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

          <FileText
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

          <p className="mt-3 text-sm leading-7 text-white/30">
            Sign in to edit your BLOGNEXUS stories.
          </p>

          <Link
            to="/login"
            className="glitch-hover premium-button mt-7 inline-flex rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14]"
          >
            SIGN IN
          </Link>
        </motion.div>
      </div>
    );
  }

  if (error && !form.title && !form.content) {
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
          className="glow-card relative w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-center backdrop-blur-sm sm:p-14"
        >
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-red-300/55">
            EDIT_ERROR
          </div>

          <motion.h1
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
            className="mt-4 font-audiowide text-2xl text-white sm:text-3xl"
          >
            UNABLE TO EDIT STORY.
          </motion.h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/30">
            {error}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/my-posts"
              className="glitch-hover premium-button inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 hover:border-white/20 hover:text-white/70"
            >
              <ArrowLeft size={14} strokeWidth={1.7} />
              MY POSTS
            </Link>

            <Link
              to="/login"
              className="glitch-hover premium-button inline-flex rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-cyan-300 hover:bg-cyan-400/[0.14]"
            >
              LOGIN AGAIN
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[92%] max-w-7xl pb-28 pt-32 sm:pt-36">
      {/* HEADER */}
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
        <Link
          to="/my-posts"
          className="glitch-hover inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30 transition-colors duration-[180ms] hover:text-cyan-300"
        >
          <ArrowLeft size={13} strokeWidth={1.7} />
          BACK TO MY STORIES
        </Link>

        <div className="mt-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60 sm:text-xs">
          <span className="h-px w-8 bg-cyan-400/50" />
          15 // EDIT // UPDATE
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
          className="mt-4 font-audiowide text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          REFINE YOUR
          <br />
          <span className="glitch-hover text-cyan-400">
            STORY.
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
          className="mt-4 max-w-2xl text-sm leading-7 text-white/35 sm:text-base"
        >
          Update your published story and keep your ideas current.
        </motion.p>
      </motion.section>

      {/* EDITOR */}
      <motion.section
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.24,
          ease: "easeOut",
        }}
        className="mt-10"
      >
        <form
          onSubmit={handleSubmit}
          className="glow-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-sm"
        >
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <FileText
                size={16}
                strokeWidth={1.7}
                className="text-cyan-300/50"
              />

              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                STORY_EDITOR
              </span>
            </div>

            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/15">
              POST_{String(postId).padStart(3, "0")}
            </span>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            {/* TITLE */}
            <div>
              <label
                htmlFor="title"
                className="mb-3 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/30"
              >
                STORY TITLE
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                maxLength={200}
                className="w-full border-0 border-b border-white/10 bg-transparent px-0 pb-4 font-audiowide text-2xl leading-tight text-white outline-none transition-colors duration-[180ms] placeholder:text-white/15 focus:border-cyan-400/30 sm:text-3xl lg:text-4xl"
              />

              <div className="mt-2 text-right font-mono text-[8px] text-white/15">
                {form.title.length}/200
              </div>
            </div>

            {/* CATEGORY */}
            <div className="mt-8">
              <label
                htmlFor="category_id"
                className="mb-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30"
              >
                <Tag size={13} strokeWidth={1.7} />
                CATEGORY
              </label>

              <select
                id="category_id"
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/60 outline-none transition-all duration-[180ms] focus:border-cyan-400/30"
              >
                <option
                  value=""
                  className="bg-[#090909]"
                >
                  No category
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

            {/* CONTENT */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <label
                  htmlFor="content"
                  className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30"
                >
                  STORY CONTENT
                </label>

                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/15">
                  {form.content.length} CHARACTERS
                </span>
              </div>

              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={16}
                className="w-full resize-y rounded-2xl border border-white/10 bg-black/25 px-5 py-5 text-sm leading-8 text-white/75 outline-none transition-all duration-[180ms] placeholder:text-white/15 focus:border-cyan-400/30 focus:bg-cyan-400/[0.015]"
              />
            </div>

            {/* ERROR */}
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="mt-5 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3"
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-red-300/65">
                  UPDATE_ERROR
                </div>

                <div className="mt-1 text-xs leading-5 text-red-200/50">
                  {error}
                </div>
              </motion.div>
            )}

            {/* SUCCESS */}
            {success && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-3"
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-cyan-300/70">
                  {success}
                </div>
              </motion.div>
            )}

            {/* ACTIONS */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/15">
                EDIT // REVIEW // UPDATE
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/posts/${postId}`}
                  className="glitch-hover premium-button rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 transition-colors duration-[180ms] hover:text-white/65"
                >
                  CANCEL
                </Link>

                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={
                    saving
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
                  className="glitch-hover premium-button flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-6 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14] hover:shadow-[0_0_28px_rgba(34,211,238,0.13)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border border-cyan-300/30 border-t-cyan-300" />
                      UPDATING...
                    </>
                  ) : (
                    <>
                      <Save
                        size={14}
                        strokeWidth={1.7}
                      />
                      UPDATE STORY
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </motion.section>
    </div>
  );
}

export default EditPost;