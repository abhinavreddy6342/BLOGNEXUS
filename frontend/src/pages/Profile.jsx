import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  CalendarDays,
  Edit3,
  Eye,
  FileText,
  Heart,
  MessageCircle,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  deletePost,
  getMyProfile,
  getPosts,
  updateMyProfile,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    username: "",
    bio: "",
  });

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const [profileResponse, postsResponse] = await Promise.all([
        getMyProfile(),
        getPosts({
          skip: 0,
          limit: 100,
        }),
      ]);

      const profileData = profileResponse.data;

      setProfile(profileData);

      setForm({
        username: profileData?.username || "",
        bio: profileData?.bio || "",
      });

      const allPosts = postsResponse.data || [];

      const userPosts = allPosts.filter(
        (post) =>
          Number(post.author_id) === Number(profileData?.id),
      );

      setPosts(userPosts);
    } catch (requestError) {
      console.error("BLOGNEXUS profile error:", requestError);

      setError(
        "Unable to load your profile. Please make sure you are logged in and the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    loadProfile();
  }, [authLoading, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSaveError("");
    setSaveSuccess("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const username = form.username.trim();
    const bio = form.bio.trim();

    if (!username) {
      setSaveError("Username cannot be empty.");
      return;
    }

    if (username.length < 3) {
      setSaveError("Username must contain at least 3 characters.");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const response = await updateMyProfile({
        username,
        bio,
      });

      const updatedProfile = response.data;

      setProfile(updatedProfile);

      setForm({
        username: updatedProfile?.username || "",
        bio: updatedProfile?.bio || "",
      });

      setEditMode(false);
      setSaveSuccess("Profile updated successfully.");

      setTimeout(() => {
        setSaveSuccess("");
      }, 2500);
    } catch (requestError) {
      console.error("BLOGNEXUS profile update error:", requestError);

      const detail = requestError?.response?.data?.detail;

      if (typeof detail === "string") {
        setSaveError(detail);
      } else if (Array.isArray(detail) && detail.length > 0) {
        setSaveError(
          detail[0]?.msg || "Unable to update your profile.",
        );
      } else {
        setSaveError("Unable to update your profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setForm({
      username: profile?.username || "",
      bio: profile?.bio || "",
    });

    setEditMode(false);
    setSaveError("");
    setSaveSuccess("");
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    const postId = Number(deleteTarget.id);

    setDeletingId(postId);

    try {
      await deletePost(postId);

      setPosts((current) =>
        current.filter((post) => Number(post.id) !== postId),
      );

      setDeleteTarget(null);
    } catch (requestError) {
      console.error("BLOGNEXUS delete post error:", requestError);

      const status = requestError?.response?.status;
      const detail = requestError?.response?.data?.detail;

      if (status === 401) {
        alert("Your session has expired. Please sign in again.");
      } else if (status === 403) {
        alert("You can only delete your own stories.");
      } else {
        alert(
          typeof detail === "string"
            ? detail
            : "Unable to delete this story.",
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  const totalLikes = posts.reduce(
    (sum, post) => sum + Number(post.likes || 0),
    0,
  );

  const totalComments = posts.reduce(
    (sum, post) => sum + Number(post.comments || 0),
    0,
  );

  if (authLoading || loading) {
    return (
      <div className="mx-auto flex min-h-screen w-[92%] max-w-7xl items-center justify-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="text-center"
        >
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-cyan-300/20 border-t-cyan-300" />

          <div className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
            LOADING PROFILE...
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user && !profile) {
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

          <UserRound
            size={22}
            strokeWidth={1.6}
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
            AUTHENTICATION REQUIRED
          </motion.h1>

          <p className="mt-3 text-sm leading-7 text-white/35">
            Sign in to access your BLOGNEXUS profile.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="glitch-hover premium-button mt-7 inline-flex rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14]"
          >
            SIGN IN
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[92%] max-w-7xl pb-28 pt-32 sm:pt-36">
      {/* HEADER */}
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
          07 // IDENTITY // PROFILE
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.08,
            ease: "easeOut",
          }}
          className="font-audiowide text-4xl leading-tight text-white sm:text-5xl"
        >
          YOUR
          <br />
          <span className="glitch-hover text-cyan-400">
            IDENTITY.
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
          className="mt-4 max-w-xl text-sm leading-7 text-white/35"
        >
          Manage your profile, review your published stories, and track
          your activity across the BLOGNEXUS network.
        </motion.p>
      </motion.section>

      {/* PROFILE + STATS */}
      <section className="mt-10">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          {/* PROFILE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="glow-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-7 backdrop-blur-sm sm:p-8"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.055]">
                <UserRound
                  size={27}
                  strokeWidth={1.5}
                  className="text-cyan-300/65"
                />
              </div>

              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="glitch-hover rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-white/35 transition-all duration-[180ms] hover:border-cyan-400/25 hover:bg-cyan-400/[0.04] hover:text-cyan-300"
                aria-label="Edit profile"
              >
                <Edit3 size={16} strokeWidth={1.7} />
              </button>
            </div>

            {editMode ? (
              <form
                onSubmit={handleSave}
                className="mt-7 space-y-5"
              >
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/30"
                  >
                    USERNAME
                  </label>

                  <input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-[180ms] placeholder:text-white/15 focus:border-cyan-400/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/30"
                  >
                    BIO
                  </label>

                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell the BLOGNEXUS community about yourself..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition-all duration-[180ms] placeholder:text-white/15 focus:border-cyan-400/30"
                  />
                </div>

                {saveError && (
                  <div className="rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-red-300/65">
                    {saveError}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="glitch-hover premium-button flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.15em] text-cyan-300 hover:bg-cyan-400/[0.14] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Save size={14} strokeWidth={1.7} />
                    {saving ? "SAVING..." : "SAVE PROFILE"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="glitch-hover flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 transition-colors duration-[180ms] hover:text-white/70"
                  >
                    <X size={13} strokeWidth={1.7} />
                    CANCEL
                  </button>
                </div>
              </form>
            ) : (
              <>
                <motion.h2
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    ease: "easeOut",
                  }}
                  className="mt-7 font-audiowide text-2xl text-white sm:text-3xl"
                >
                  {profile?.username || "BLOGNEXUS USER"}
                </motion.h2>

                <div className="mt-2 break-all font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-300/35">
                  {profile?.email || user?.email}
                </div>

                <p className="mt-5 text-sm leading-7 text-white/35">
                  {profile?.bio ||
                    "No bio added yet. Tell the BLOGNEXUS community something about yourself."}
                </p>

                <div className="mt-7 flex items-center gap-2 border-t border-white/10 pt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/20">
                  <CalendarDays size={13} strokeWidth={1.7} />
                  MEMBER OF BLOGNEXUS
                </div>
              </>
            )}

            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-300/65"
              >
                {saveSuccess}
              </motion.div>
            )}
          </motion.div>

          {/* STATISTICS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.28,
              ease: "easeOut",
            }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              {
                value: posts.length,
                label: "STORIES",
                icon: FileText,
              },
              {
                value: totalLikes,
                label: "LIKES",
                icon: Heart,
              },
              {
                value: totalComments,
                label: "COMMENTS",
                icon: MessageCircle,
              },
              {
                value: "∞",
                label: "IDEAS",
                icon: Bookmark,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
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
                    delay: 0.32 + index * 0.08,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -4,
                  }}
                  className="glow-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-sm"
                >
                  <span className="card-corner card-corner-tl" />
                  <span className="card-corner card-corner-tr" />
                  <span className="card-corner card-corner-bl" />
                  <span className="card-corner card-corner-br" />

                  <Icon
                    size={17}
                    strokeWidth={1.7}
                    className="text-cyan-300/45 transition-colors duration-[180ms] group-hover:text-cyan-300"
                  />

                  <div className="mt-5 font-audiowide text-2xl text-white sm:text-3xl">
                    {stat.value}
                  </div>

                  <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.17em] text-white/25">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* STORIES */}
      <section className="mt-20">
        <motion.div
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
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/50">
            08 // PUBLISHED WORK
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
            YOUR STORIES
          </motion.h2>

          <p className="mt-3 text-sm leading-7 text-white/35">
            Everything you've published on BLOGNEXUS.
          </p>
        </motion.div>

        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="glow-card relative mt-8 rounded-2xl border border-red-400/10 bg-red-400/[0.025] p-10 text-center"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-red-300/55">
              PROFILE_ERROR
            </div>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/30">
              {error}
            </p>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="glow-card relative mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <FileText
              size={23}
              strokeWidth={1.5}
              className="mx-auto text-cyan-300/35"
            />

            <motion.h3
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.08,
                ease: "easeOut",
              }}
              className="mt-5 font-audiowide text-xl text-white"
            >
              NO STORIES YET.
            </motion.h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/30">
              Your first story can start the journey.
            </p>

            <button
              type="button"
              onClick={() => navigate("/create-post")}
              className="glitch-hover premium-button mt-7 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14]"
            >
              CREATE YOUR FIRST STORY
            </button>
          </motion.div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {posts.map((post, index) => (
              <motion.div
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
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
              >
                <PostCard
                  post={post}
                  index={index}
                />

                {/* STORY ACTIONS */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/posts/${post.id}`)
                    }
                    className="glitch-hover flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/40 transition-all duration-[180ms] hover:border-white/20 hover:text-white/75"
                  >
                    <Eye size={13} strokeWidth={1.7} />
                    VIEW
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/posts/${post.id}/edit`)
                    }
                    className="glitch-hover flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-300/70 transition-all duration-[180ms] hover:border-cyan-400/40 hover:bg-cyan-400/[0.08] hover:text-cyan-300"
                  >
                    <Edit3 size={13} strokeWidth={1.7} />
                    EDIT
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(post)}
                    disabled={deletingId === Number(post.id)}
                    className="glitch-hover flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.03] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-red-300/55 transition-all duration-[180ms] hover:border-red-400/30 hover:bg-red-400/[0.06] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 size={13} strokeWidth={1.7} />
                    {deletingId === Number(post.id)
                      ? "DELETING..."
                      : "DELETE"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm">
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
            className="glow-card relative w-full max-w-md rounded-3xl border border-white/10 bg-[#050505] p-7 shadow-2xl"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="absolute right-5 top-5 rounded-lg p-2 text-white/30 transition-colors hover:text-white/70"
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/[0.04]">
              <Trash2
                size={20}
                strokeWidth={1.6}
                className="text-red-300/65"
              />
            </div>

            <div className="mt-6 font-mono text-[9px] uppercase tracking-[0.18em] text-red-300/55">
              DESTRUCTIVE_ACTION
            </div>

            <h3 className="mt-2 font-audiowide text-xl text-white">
              DELETE STORY?
            </h3>

            <p className="mt-3 text-sm leading-7 text-white/35">
              This action permanently removes your story from
              BLOGNEXUS. This cannot be undone.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="font-audiowide text-sm text-white/70">
                {deleteTarget.title}
              </div>

              <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.15em] text-white/20">
                POST_{deleteTarget.id}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="glitch-hover flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-400/[0.07] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-red-300 hover:bg-red-400/[0.12] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={13} strokeWidth={1.7} />
                {deletingId !== null ? "DELETING..." : "DELETE STORY"}
              </button>

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deletingId !== null}
                className="glitch-hover rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 hover:text-white/70 disabled:opacity-40"
              >
                CANCEL
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Profile;