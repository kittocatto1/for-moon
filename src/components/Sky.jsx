import { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { seeded } from "../lib.js";
import "./Sky.css";

// The fixed night sky behind everything. Stars drift very slightly with scroll.
export default function Sky({ dim = false }) {
  const stars = useMemo(() => {
    const rand = seeded(1204);
    return Array.from({ length: 84 }, (_, i) => {
      const big = rand() > 0.9;
      return {
        id: i,
        left: rand() * 100,
        top: rand() * 100,
        size: big ? 2.2 : 1 + rand() * 0.9,
        opacity: 0.25 + rand() * (big ? 0.6 : 0.45),
        twinkle: rand() > 0.7,
        duration: 4 + rand() * 5,
        delay: rand() * -8,
      };
    });
  }, []);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * -0.04);

  return (
    <div className={`sky${dim ? " sky--dim" : ""}`} aria-hidden="true">
      <div className="sky__moonlight" />
      <motion.div className="sky__stars" style={{ y }}>
        {stars.map((s) => (
          <span
            key={s.id}
            className={`star${s.twinkle ? " star--twinkle" : ""}`}
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              "--o": s.opacity,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </motion.div>
      <div className="sky__grain" />
    </div>
  );
}
