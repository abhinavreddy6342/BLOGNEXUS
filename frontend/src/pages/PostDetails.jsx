import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  bookmarkPost,
  createComment,
  deleteComment,
  getComments,
  getPost,
  getPostLikes,
  removeBookmark,
  likePost,
  unlikePost,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(true);
  const [submittingComment, setSubmittingComment] =
    useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getPost(postId);
        setPost(response.data);
      } catch (requestError) {
        console.error("BLOGNEXUS post error:", requestError);
        setPost(null);
        setError(
          "Unable to load this story. The post may not exist anymore.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId]);

  useEffect(() => {
    const loadComments = async () => {
      setCommentLoading(true);
      setCommentError("");

      try {
        const response = await getComments(postId);
        setComments(response.data || []);
      } catch (requestError) {
        console.error(
          "BLOGNEXUS comments error:",
          requestError,
        );
        setComments([]);
        setCommentError("Unable to load comments.");
      } finally {
        setCommentLoading(false);
      }
    };

    if (postId) {
      loadComments();
    }
  }, [postId]);

  useEffect(() => {
    const loadLikes = async () => {
      try {
        const response = await getPostLikes(postId);

        const data = response.data;

        if (typeof data === "number") {
          setLikesCount(data);
          return;
        }

        if (Array.isArray(data)) {
          setLikesCount(data.length);

          if (user?.id) {
            setLiked(
              data.some(
                (like) =>
                  like.user_id === user.id ||
                  like.user?.id === user.id,
              ),
            );
          }

          return;
        }

        if (data && typeof data === "object") {
          setLikesCount(
            Number(
              data.count ??
                data.likes_count ??
                data.total ??
                0,
            ),
          );

          if (typeof data.liked === "boolean") {
            setLiked(data.liked);
          }
        }
      } catch (requestError) {
        console.error(
          "BLOGNEXUS likes error:",
          requestError,
        );
      }
    };

    if (postId && isAuthenticated) {
      loadLikes();
    } else if (post?.likes !== undefined) {
      setLikesCount(Number(post.likes || 0));
    }
  }, [postId, isAuthenticated, user, post]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/posts/${postId}`,
        },
      });
      return;
    }

    if (actionLoading) {
      return;
    }

    setActionLoading(true);

    const previousLiked = liked;
    const previousCount = likesCount;

    setLiked(!previousLiked);
    setLikesCount(
      previousLiked
        ? Math.max(previousCount - 1, 0)
        : previousCount + 1,
    );

    try {
      if (previousLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (requestError) {
      console.error(
        "BLOGNEXUS like action error:",
        requestError,
      );

      setLiked(previousLiked);
      setLikesCount(previousCount);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/posts/${postId}`,
        },
      });
      return;
    }

    if (actionLoading) {
      return;
    }

    setActionLoading(true);

    const previousBookmarked = bookmarked;
    setBookmarked(!previousBookmarked);

    try {
      if (previousBookmarked) {
        await removeBookmark(postId);
      } else {
        await bookmarkPost(postId);
      }
    } catch (requestError) {
      console.error(
        "BLOGNEXUS bookmark action error:",
        requestError,
      );

      setBookmarked(previousBookmarked);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/posts/${postId}`,
        },
      });
      return;
    }

    const content = commentText.trim();

    if (!content) {
      setCommentError("Write a comment before submitting.");
      return;
    }

    if (content.length < 2) {
      setCommentError(
        "Your comment should contain at least 2 characters.",
      );
      return;
    }

    setSubmittingComment(true);
    setCommentError("");

    try {
      const response = await createComment(postId, {
        content,
      });

      const newComment = response.data;

      setComments((current) => [
        ...current,
        newComment,
      ]);

      setCommentText("");
    } catch (requestError) {
      console.error(
        "BLOGNEXUS create comment error:",
        requestError,
      );

      const detail =
        requestError?.response?.data?.detail;

      if (typeof detail === "string") {
        setCommentError(detail);
      } else {
        setCommentError(
          "Unable to publish your comment.",
        );
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);

      setComments((current) =>
        current.filter(
          (comment) => comment.id !== commentId,
        ),
      );
    } catch (requestError) {
      console.error(
        "BLOGNEXUS delete comment error:",
        requestError,
      );

      setCommentError(
        "Unable to delete this comment.",
      );
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
            LOADING STORY...
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto flex min-h-screen w-[92%] max-w-7xl items-center justify-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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
            404 // STORY NOT FOUND
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.08,
              ease: "easeOut",
            }}
            className="mt-5 font-audiowide text-2xl text-white sm:text-3xl"
          >
            THIS STORY IS UNAVAILABLE.
          </motion.h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/30">
            {error ||
              "The requested story could not be found."}
          </p>

          <Link
            to="/explore"
            className="glitch-hover premium-button mt-7 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-6 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14]"
          >
            <ArrowLeft size={14} strokeWidth={1.7} />
            Back to Explore
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[92%] max-w-5xl pb-28 pt-32 sm:pt-36">
      {/* =====================================================
          BACK
      ====================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <Link
          to="/explore"
          className="glitch-hover inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30 transition-colors duration-[180ms] hover:text-cyan-300"
        >
          <ArrowLeft size={13} strokeWidth={1.7} />
          Back to Explore
        </Link>
      </motion.div>

      {/* =====================================================
          ARTICLE
      ====================================================== */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.65,
          delay: 0.08,
          ease: "easeOut",
        }}
        className="mt-8"
      >
        <div className="glow-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-sm">
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <div className="p-6 sm:p-9 lg:p-12">
            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.14,
                ease: "easeOut",
              }}
              className="flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em]"
            >
              <span className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] px-2.5 py-1.5 text-cyan-300/60">
                {post.category || "GENERAL"}
              </span>

              <span className="text-white/20">
                POST_{String(post.id).padStart(3, "0")}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="mt-7 font-audiowide text-3xl leading-tight text-white sm:text-4xl lg:text-5xl"
            >
              {post.title}
            </motion.h1>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
              }}
              className="mt-7 flex items-center gap-3 border-b border-white/10 pb-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04]">
                <UserRound
                  size={17}
                  strokeWidth={1.7}
                  className="text-cyan-300/55"
                />
              </div>

              <div>
                <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">
                  AUTHOR
                </div>

                <div className="mt-1 text-sm text-white/55">
                  {post.author ||
                    post.author_username ||
                    `USER_${post.author_id}`}
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.38,
                ease: "easeOut",
              }}
              className="mt-8 whitespace-pre-wrap text-sm leading-8 text-white/60 sm:text-base sm:leading-9"
            >
              {post.content}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.46,
                ease: "easeOut",
              }}
              className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6"
            >
              <motion.button
                type="button"
                onClick={handleLike}
                whileHover={{
                  y: -2,
                }}
                transition={{
                  duration: 0.18,
                  ease: "easeOut",
                }}
                className={`glitch-hover premium-button inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-all duration-[180ms] ${
                  liked
                    ? "border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-300"
                    : "border-white/10 bg-white/[0.02] text-white/35 hover:border-cyan-400/25 hover:text-cyan-300"
                }`}
              >
                <Heart
                  size={15}
                  strokeWidth={1.7}
                  fill={liked ? "currentColor" : "none"}
                />
                {likesCount}{" "}
                {likesCount === 1 ? "LIKE" : "LIKES"}
              </motion.button>

              <motion.button
                type="button"
                onClick={handleBookmark}
                whileHover={{
                  y: -2,
                }}
                transition={{
                  duration: 0.18,
                  ease: "easeOut",
                }}
                className={`glitch-hover premium-button inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-all duration-[180ms] ${
                  bookmarked
                    ? "border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-300"
                    : "border-white/10 bg-white/[0.02] text-white/35 hover:border-cyan-400/25 hover:text-cyan-300"
                }`}
              >
                <Bookmark
                  size={15}
                  strokeWidth={1.7}
                  fill={
                    bookmarked
                      ? "currentColor"
                      : "none"
                  }
                />
                {bookmarked
                  ? "SAVED"
                  : "BOOKMARK"}
              </motion.button>

              <div className="ml-auto flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/20">
                <MessageCircle
                  size={14}
                  strokeWidth={1.7}
                />
                {comments.length}{" "}
                {comments.length === 1
                  ? "COMMENT"
                  : "COMMENTS"}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.article>

      {/* =====================================================
          COMMENTS
      ====================================================== */}
      <section className="mt-16">
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
            10 // COMMUNITY // DISCUSSION
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
            THE CONVERSATION.
          </motion.h2>

          <p className="mt-3 text-sm leading-7 text-white/30">
            Share your perspective and continue the discussion.
          </p>
        </motion.div>

        {/* Comment form */}
        <motion.form
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            delay: 0.14,
            ease: "easeOut",
          }}
          onSubmit={handleSubmitComment}
          className="glow-card relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6"
        >
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />

          <textarea
            value={commentText}
            onChange={(event) => {
              setCommentText(event.target.value);
              setCommentError("");
            }}
            placeholder={
              isAuthenticated
                ? "Share your thoughts..."
                : "Sign in to join the conversation..."
            }
            rows={4}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-4 text-sm leading-7 text-white/75 outline-none transition-all duration-[180ms] placeholder:text-white/15 focus:border-cyan-400/30"
          />

          {commentError && (
            <div className="mt-3 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-red-300/60">
              {commentError}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-4">
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/15">
              COMMUNITY_INPUT
            </span>

            <motion.button
              type="submit"
              disabled={submittingComment}
              whileHover={
                submittingComment
                  ? {}
                  : {
                      y: -2,
                    }
              }
              transition={{
                duration: 0.18,
                ease: "easeOut",
              }}
              className="glitch-hover premium-button flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.15em] text-cyan-300 hover:bg-cyan-400/[0.14] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submittingComment ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border border-cyan-300/30 border-t-cyan-300" />
                  POSTING...
                </>
              ) : (
                <>
                  POST COMMENT
                  <Send size={14} strokeWidth={1.7} />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Comment list */}
        <div className="mt-6 space-y-4">
          {commentLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.015] p-5"
              >
                <div className="h-3 w-24 animate-pulse rounded bg-white/[0.05]" />
                <div className="mt-4 h-3 w-full animate-pulse rounded bg-white/[0.035]" />
                <div className="mt-2 h-3 w-[75%] animate-pulse rounded bg-white/[0.035]" />
              </div>
            ))
          ) : commentError && comments.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-8 text-center">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
                COMMENTS_UNAVAILABLE
              </div>
            </div>
          ) : comments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
              }}
              className="rounded-2xl border border-white/10 bg-white/[0.015] p-10 text-center"
            >
              <MessageCircle
                size={21}
                strokeWidth={1.5}
                className="mx-auto text-cyan-300/30"
              />

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.06,
                  ease: "easeOut",
                }}
                className="mt-4 font-audiowide text-lg text-white"
              >
                START THE CONVERSATION.
              </motion.h3>

              <p className="mt-2 text-sm text-white/25">
                Be the first person to comment on this story.
              </p>
            </motion.div>
          ) : (
            comments.map((comment, index) => {
              const commentAuthor =
                comment.author ||
                comment.username ||
                comment.author_username ||
                `USER_${comment.user_id}`;

              const isCommentOwner =
                user?.id &&
                (comment.user_id === user.id ||
                  comment.author_id === user.id);

              return (
                <motion.article
                  key={comment.id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                  className="glow-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <span className="card-corner card-corner-tl" />
                  <span className="card-corner card-corner-tr" />
                  <span className="card-corner card-corner-bl" />
                  <span className="card-corner card-corner-br" />

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02]">
                      <UserRound
                        size={15}
                        strokeWidth={1.7}
                        className="text-white/25"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-300/55">
                            {commentAuthor}
                          </div>

                          <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-white/15">
                            COMMENT_{String(
                              comment.id,
                            ).padStart(3, "0")}
                          </div>
                        </div>

                        {isCommentOwner && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteComment(
                                comment.id,
                              )
                            }
                            className="rounded-lg p-2 text-white/20 transition-colors duration-[180ms] hover:text-red-300"
                            aria-label="Delete comment"
                          >
                            <Trash2
                              size={14}
                              strokeWidth={1.7}
                            />
                          </button>
                        )}
                      </div>

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/45">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

export default PostDetails;