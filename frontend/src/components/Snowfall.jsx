import { useMemo } from "react";
import { motion } from "framer-motion";

function Snowfall() {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 8,
      drift: Math.random() * 80 - 40,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-cyan-200/20"
          style={{
            left: `${particle.left}%`,
            top: "-10px",
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, particle.drift, 0],
            opacity: [0, 0.5, 0.2, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default Snowfall;