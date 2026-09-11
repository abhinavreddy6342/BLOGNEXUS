import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Code2,
  Heart,
  Lightbulb,
  Users,
  Zap,
} from "lucide-react";

const principles = [
  {
    number: "01",
    icon: Lightbulb,
    title: "IDEAS FIRST",
    text: "BLOGNEXUS is built around the belief that a strong idea deserves a place to be shared.",
  },
  {
    number: "02",
    icon: Users,
    title: "COMMUNITY",
    text: "Readers and writers are part of the same network, connected through ideas and conversations.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "KNOWLEDGE",
    text: "Technical insights, experiences, lessons, and creative perspectives belong together.",
  },
  {
    number: "04",
    icon: Heart,
    title: "AUTHENTICITY",
    text: "Write from experience, learn from others, and contribute something meaningful.",
  },
];

const technology = [
  ["FRONTEND", "REACT + VITE"],
  ["BACKEND", "FASTAPI + PYTHON"],
  ["DATABASE", "POSTGRESQL"],
  ["AUTH", "JWT"],
  ["ORM", "SQLALCHEMY"],
  ["API", "REST"],
];

function AnimatedHeading({
  eyebrow,
  children,
  description,
  delay = 0,
  center = false,
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.6,
          delay,
          ease: "easeOut",
        }}
        className={`mb-3 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.22em] text-cyan-300/55 ${
          center ? "justify-center" : ""
        }`}
      >
        {!center && <span className="h-px w-8 bg-cyan-400/50" />}
        {eyebrow}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.6,
          delay: delay + 0.06,
          ease: "easeOut",
        }}
        className="font-audiowide text-3xl leading-tight text-white sm:text-4xl"
      >
        {children}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            delay: delay + 0.14,
            ease: "easeOut",
          }}
          className={`mt-4 max-w-2xl text-sm leading-7 text-white/35 sm:text-base ${
            center ? "mx-auto" : ""
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

function About() {
  return (
    <div className="mx-auto w-[92%] max-w-7xl pb-28 pt-32 sm:pt-36">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative min-h-[72vh]">
        <div className="grid min-h-[72vh] items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/60 sm:text-xs"
            >
              <span className="h-px w-8 bg-cyan-400/50" />
              04 // ABOUT // BLOGNEXUS
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.08,
                ease: "easeOut",
              }}
              className="font-audiowide text-5xl leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              A NETWORK
              <br />
              FOR
              <br />
              <span className="glitch-hover text-cyan-400">
                THINKERS.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.22,
                ease: "easeOut",
              }}
              className="mt-7 max-w-2xl text-sm leading-8 text-white/40 sm:text-base"
            >
              BLOGNEXUS is a modern blogging and community platform designed
              for people who have something to say, something to teach, or
              something worth exploring.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.34,
                ease: "easeOut",
              }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <motion.a
                href="/explore"
                whileHover={{
                  y: -2,
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.18,
                  ease: "easeOut",
                }}
                className="glitch-hover premium-button inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14] hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]"
              >
                Explore Stories
                <ArrowUpRight size={14} strokeWidth={1.7} />
              </motion.a>

              <motion.a
                href="/register"
                whileHover={{
                  y: -2,
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.18,
                  ease: "easeOut",
                }}
                className="glitch-hover premium-button rounded-xl border border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 hover:border-white/20 hover:text-white"
              >
                Join the Network
              </motion.a>
            </motion.div>
          </div>

          {/* System visual */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.65,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="glow-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8"
          >
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
                NETWORK_STATUS
              </span>

              <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-300/55">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_8px_rgba(103,232,249,0.7)]" />
                ONLINE
              </span>
            </div>

            <div className="py-10">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/45">
                BLOGNEXUS_CORE
              </div>

              <div className="mt-4 font-audiowide text-5xl text-white sm:text-6xl">
                BN<span className="text-cyan-400">.</span>
              </div>

              <p className="mt-5 text-sm leading-7 text-white/30">
                Stories become knowledge. Knowledge becomes connection.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
              <div>
                <div className="font-audiowide text-xl text-white">
                  ∞
                </div>

                <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white/20">
                  IDEAS
                </div>
              </div>

              <div>
                <div className="font-audiowide text-xl text-white">
                  24/7
                </div>

                <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white/20">
                  COMMUNITY
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          MISSION
      ====================================================== */}
      <section className="mt-20">
        <AnimatedHeading
          eyebrow="05 // MISSION"
          description="We are building a place where publishing is simple, discovery feels intentional, and every useful idea can travel further."
        >
          WE BELIEVE
          <br />
          <span className="text-cyan-400">IDEAS MATTER.</span>
        </AnimatedHeading>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]"
        >
          <div className="glow-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-7 sm:p-9">
            <span className="card-corner card-corner-tl" />
            <span className="card-corner card-corner-tr" />
            <span className="card-corner card-corner-bl" />
            <span className="card-corner card-corner-br" />

            <Code2
              size={20}
              strokeWidth={1.6}
              className="text-cyan-300/50"
            />

            <motion.h3
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: 0.26,
                ease: "easeOut",
              }}
              className="mt-7 font-audiowide text-2xl text-white sm:text-3xl"
            >
              FROM BUILDERS
              <br />
              <span className="text-cyan-400">TO BUILDERS.</span>
            </motion.h3>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/35">
              BLOGNEXUS is especially designed to give developers, creators,
              students, writers, and curious minds a space where practical
              knowledge and original perspectives can live together.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.55,
                delay: 0.28,
                ease: "easeOut",
              }}
              className="glow-card relative rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <Zap
                size={18}
                strokeWidth={1.7}
                className="text-cyan-300/50"
              />

              <h3 className="mt-5 font-audiowide text-xl text-white">
                SIMPLE
              </h3>

              <p className="mt-3 text-xs leading-6 text-white/30">
                Write, publish, discover, and connect without unnecessary
                friction.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.55,
                delay: 0.36,
                ease: "easeOut",
              }}
              className="glow-card relative rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <Users
                size={18}
                strokeWidth={1.7}
                className="text-cyan-300/50"
              />

              <h3 className="mt-5 font-audiowide text-xl text-white">
                HUMAN
              </h3>

              <p className="mt-3 text-xs leading-6 text-white/30">
                Technology supports the community; people and ideas remain at
                the center.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          PRINCIPLES
      ====================================================== */}
      <section className="mt-24">
        <AnimatedHeading
          eyebrow="06 // PRINCIPLES"
          description="Four principles shape how BLOGNEXUS should feel, function, and evolve."
        >
          BUILT AROUND
          <br />
          <span className="text-cyan-400">PEOPLE + IDEAS.</span>
        </AnimatedHeading>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {principles.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.number}
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
                className="glow-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-7 backdrop-blur-sm"
              >
                <span className="card-corner card-corner-tl" />
                <span className="card-corner card-corner-tr" />
                <span className="card-corner card-corner-bl" />
                <span className="card-corner card-corner-br" />

                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] text-white/35 transition-all duration-[180ms] group-hover:border-cyan-400/25 group-hover:bg-cyan-400/[0.05] group-hover:text-cyan-300">
                    <Icon size={19} strokeWidth={1.7} />
                  </div>

                  <span className="font-mono text-[9px] tracking-[0.16em] text-white/20">
                    {item.number}
                  </span>
                </div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08 + 0.08,
                    ease: "easeOut",
                  }}
                  className="mt-7 font-audiowide text-xl text-white transition-colors duration-[180ms] group-hover:text-cyan-300"
                >
                  {item.title}
                </motion.h3>

                <p className="mt-3 text-sm leading-7 text-white/30">
                  {item.text}
                </p>

                <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cyan-400/70 transition-transform duration-300 group-hover:scale-x-100" />
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          TECHNOLOGY
      ====================================================== */}
      <section className="mt-24">
        <AnimatedHeading
          eyebrow="07 // TECHNOLOGY"
          description="BLOGNEXUS is built as a full-stack application with a modern frontend, API-driven backend, relational database, and secure authentication."
        >
          THE STACK
          <br />
          <span className="text-cyan-400">BEHIND THE NETWORK.</span>
        </AnimatedHeading>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {technology.map(([label, value], index) => (
            <motion.div
              key={label}
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
                duration: 0.55,
                delay: index * 0.07,
                ease: "easeOut",
              }}
              className="glow-card group relative rounded-xl border border-white/10 bg-white/[0.02] p-5"
            >
              <span className="card-corner card-corner-tl" />
              <span className="card-corner card-corner-tr" />
              <span className="card-corner card-corner-bl" />
              <span className="card-corner card-corner-br" />

              <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">
                {label}
              </div>

              <div className="mt-3 font-audiowide text-sm text-white transition-colors duration-[180ms] group-hover:text-cyan-300">
                {value}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
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
        className="mt-24"
      >
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.035] px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-cyan-400/[0.08] blur-3xl" />

          <div className="relative">
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-cyan-300/55">
              08 // YOUR TURN
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
                delay: 0.08,
                ease: "easeOut",
              }}
              className="mx-auto mt-4 max-w-3xl font-audiowide text-3xl leading-tight text-white sm:text-5xl"
            >
              HAVE AN IDEA?
              <br />
              <span className="glitch-hover text-cyan-400">
                MAKE IT VISIBLE.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: 0.16,
                ease: "easeOut",
              }}
              className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/35"
            >
              Join BLOGNEXUS and turn your knowledge, experiences, and ideas
              into something others can discover.
            </motion.p>

            <motion.a
              href="/register"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.55,
                delay: 0.24,
                ease: "easeOut",
              }}
              whileHover={{
                y: -2,
                scale: 1.015,
              }}
              className="glitch-hover premium-button mt-8 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-7 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/[0.14] hover:shadow-[0_0_28px_rgba(34,211,238,0.13)]"
            >
              Start Writing
              <ArrowUpRight size={15} strokeWidth={1.7} />
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default About;