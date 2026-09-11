import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  ImagePlus,
  PenLine,
  Send,
  Tag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  createPost,
  getCategories,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function CreatePost() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category_id: "",
  });

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (requestError) {
        console.error("BLOGNEXUS categories error:", requestError);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [authLoading, isAuthenticated]);

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

    const title = form.title.trim();
    const content = form.content.trim();

    if (!title) {
      setError("Please enter a title for your story.");
      return;
    }

    if (title.length < 5) {
      setError("Your title should contain at least 5 characters.");
      return;
    }

    if (!content) {
      setError("Please write some content before publishing.");
      return;
    }

    if (content.length < 20) {
      setError("Your story should contain at least 20 characters.");
      return;
    }

    setPublishing(true);
    setError("");

    try {
      const payload = {
        title,
        content,
      };

      if (form.category_id) {
        payload.category_id = Number(form.category_id);
      }

      const response = await createPost(payload);

      const createdPost = response.data;

      if (createdPost?.id) {
        navigate(`/posts/${createdPost.id}`);
      } else {
        navigate("/profile");
      }
    } catch (requestError) {
      console.error("BLOGNEXUS create post error:", requestError);

      const detail = requestError?.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail) && detail.length > 0) {
        setError(
          detail[0]?.msg || "Unable to publish your story.",
        );
      } else {
        setError(
          "Unable to publish your story. Please try again.",
        );
      }
    } finally {
      setPublishing(false);
    }
  };

  if (authLoading) {
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
            CHECKING ACCESS...
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

          <PenLine
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
            SIGN IN REQUIRED
          </motion.h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/30">
            Create an account or sign in before publishing your first
            BLOGNEXUS story.
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
      {/* =====================================================
          HEADER
      ====================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <Link
          to="/profile"
          className="glitch-hover inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30 transition-colors duration-[180ms] hover:text-cyan-300"
        >
          <ArrowLeft size={13} strokeWidth={1.7} />
          Back to Profile
        </Link>

        <div className="mt-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60 sm:text-xs">
          <span className="h-px w-8 bg-cyan-400/50" />
          09 // CREATE // PUBLISH
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.08,
            ease: "easeOut",
          }}
          className="mt-4 font-audiowide text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          WRITE YOUR
          <br />
          <span className="glitch-hover text-cyan-400">
            STORY.
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
          className="mt-4 max-w-2xl text-sm leading-7 text-white/35 sm:text-base"
        >
          Share an idea, explain something you learned, document your
          experience, or start a conversation with the BLOGNEXUS community.
        </motion.p>
      </motion.section>

      {/* =====================================================
          EDITOR
      ====================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
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

          <div className="border-b border-white/10 px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between">
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
                DRAFT_MODE
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            {/* Title */}
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
                placeholder="Give your story a strong title..."
                maxLength={200}
                className="w-full border-0 border-b border-white/10 bg-transparent px-0 pb-4 font-audiowide text-2xl leading-tight text-white outline-none transition-colors duration-[180ms] placeholder:text-white/15 focus:border-cyan-400/30 sm:text-3xl lg:text-4xl"
              />

              <div className="mt-2 text-right font-mono text-[8px] text-white/15">
                {form.title.length}/200
              </div>
            </div>

            {/* Category */}
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
                disabled={loadingCategories}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/60 outline-none transition-all duration-[180ms] focus:border-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <option
                  value=""
                  className="bg-[#090909]"
                >
                  Select a category
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

            {/* Content */}
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
                placeholder="Start writing your story..."
                rows={15}
                className="w-full resize-y rounded-2xl border border-white/10 bg-black/25 px-5 py-5 text-sm leading-8 text-white/80 outline-none transition-all duration-[180ms] placeholder:text-white/15 focus:border-cyan-400/30 focus:bg-cyan-400/[0.015] focus:shadow-[0_0_30px_rgba(34,211,238,0.05)]"
              />
            </div>

            {/* Optional media note */}
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.015] px-4 py-3">
              <div className="flex items-center gap-3">
                <ImagePlus
                  size={15}
                  strokeWidth={1.7}
                  className="text-white/20"
                />

                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/20">
                  MEDIA SUPPORT CAN BE ADDED IN THE NEXT ITERATION
                </span>
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
                className="mt-5 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3"
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-red-300/65">
                  PUBLISH_ERROR
                </div>

                <div className="mt-1 text-xs leading-5 text-red-200/50">
                  {error}
                </div>
              </motion.div>
            )}

            {/* Bottom actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/15">
                YOUR IDEA // YOUR VOICE // YOUR STORY
              </div>

              <div className="flex gap-3">
                <Link
                  to="/profile"
                  className="glitch-hover rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 transition-all duration-[180ms] hover:border-white/20 hover:text-white/60"
                >
                  Cancel
                </Link>

                <motion.button
                  type="submit"
                  disabled={publishing}
                  whileHover={
                    publishing
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
                  className="glitch-hover premium-button flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-6 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14] hover:shadow-[0_0_28px_rgba(34,211,238,0.13)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {publishing ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border border-cyan-300/30 border-t-cyan-300" />
                      PUBLISHING...
                    </>
                  ) : (
                    <>
                      PUBLISH STORY
                      <Send size={14} strokeWidth={1.7} />
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

export default CreatePost;