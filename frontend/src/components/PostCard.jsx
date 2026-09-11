import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bookmark,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function PostCard({
  post,
  featured = false,
  index = 0,
}) {
  const navigate = useNavigate();

  const postPath = `/posts/${post.id}`;

  const openPost = () => {
    navigate(postPath);
  };

  return (
    <motion.article
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
      whileHover={{
        y: -4,
      }}
      className={`glow-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-sm ${
        featured ? "min-h-[420px]" : "min-h-[350px]"
      }`}
    >
      {/* Cyberpunk corners */}
      <span className="card-corner card-corner-tl" />
      <span className="card-corner card-corner-tr" />
      <span className="card-corner card-corner-bl" />
      <span className="card-corner card-corner-br" />

      {/* Hover scan */}
      <div className="scan-surface pointer-events-none absolute inset-0" />

      {/* Entire card */}
      <button
        type="button"
        onClick={openPost}
        className="absolute inset-0 z-0 cursor-pointer"
        aria-label={`Open ${post.title}`}
      />

      <div className="relative z-10 flex h-full flex-col p-6 pointer-events-none">
        {/* Top metadata */}
        <div className="flex items-center justify-between">
          <span className="glitch-hover font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/65">
            {post.category || "GENERAL"}
          </span>

          <span className="font-mono text-[9px] tracking-[0.12em] text-white/20">
            POST_{String(post.id).padStart(3, "0")}
          </span>
        </div>

        {/* Main content */}
        <div className="mt-7 flex-1">
          <motion.h3
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
              amount: 0.15,
            }}
            transition={{
              duration: 0.6,
              delay: index * 0.08 + 0.06,
              ease: "easeOut",
            }}
            className={`font-audiowide leading-tight text-white transition-colors duration-[180ms] group-hover:text-cyan-300 ${
              featured
                ? "text-2xl sm:text-3xl"
                : "text-xl"
            }`}
          >
            {post.title}
          </motion.h3>

          <motion.p
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
              amount: 0.15,
            }}
            transition={{
              duration: 0.6,
              delay: index * 0.08 + 0.12,
              ease: "easeOut",
            }}
            className="mt-4 line-clamp-4 text-sm leading-7 text-white/40"
          >
            {post.content}
          </motion.p>
        </div>

        {/* Bottom metadata */}
        <div className="mt-7 border-t border-white/10 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/20">
                AUTHOR
              </div>

              <div className="mt-1 text-sm text-white/60">
                {post.author || `USER_${post.author_id}`}
              </div>
            </div>

            <motion.span
              whileHover={{
                x: 2,
                y: -2,
              }}
              transition={{
                duration: 0.18,
                ease: "easeOut",
              }}
              className="rounded-xl border border-white/10 p-2.5 text-white/35 transition-all duration-[180ms] group-hover:border-cyan-400/30 group-hover:text-cyan-300 group-hover:shadow-[0_0_18px_rgba(34,211,238,0.1)]"
            >
              <ArrowUpRight
                size={16}
                strokeWidth={1.7}
              />
            </motion.span>
          </div>

          {/* Interaction row */}
          <div className="mt-5 flex items-center gap-5 text-white/25">
            <span className="group/action flex items-center gap-1.5 transition-colors duration-[180ms] group-hover:text-cyan-300">
              <Heart
                size={14}
                strokeWidth={1.7}
                className="transition-transform duration-[180ms] group-hover/action:scale-110"
              />

              <span className="font-mono text-[10px]">
                {post.likes ?? 0}
              </span>
            </span>

            <span className="group/action flex items-center gap-1.5 transition-colors duration-[180ms] group-hover:text-cyan-300">
              <MessageCircle
                size={14}
                strokeWidth={1.7}
                className="transition-transform duration-[180ms] group-hover/action:scale-110"
              />

              <span className="font-mono text-[10px]">
                {post.comments ?? 0}
              </span>
            </span>

            <span className="ml-auto transition-colors duration-[180ms] group-hover:text-cyan-300">
              <Bookmark
                size={14}
                strokeWidth={1.7}
              />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default PostCard;