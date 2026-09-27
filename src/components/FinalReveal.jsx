import { useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { birthdayData } from "../data/birthday.js";
import { EASE, toParagraphs } from "../lib.js";
import "./FinalReveal.css";

const CRATERS = [
  [38, 40, 7], [62, 34, 4.5], [62, 72, 7], [28, 70, 3.5], [72, 52, 3], [46, 26, 3],
];

export default function FinalReveal({ onRestart }) {
  const { name, from, finalMessage, easterEgg, text } = birthdayData;
  const paragraphs = toParagraphs(finalMessage);
  const [taps, setTaps] = useState(0);
  const controls = useAnimationControls();
  const found = taps >= 3;

  const poke = () => {
    setTaps((t) => t + 1);
    controls.start({
      rotate: [0, -6, 4, 0],
      scale: [1, 0.96, 1.02, 1],
      transition: { duration: 0.7, ease: EASE },
    });
  };

  return (
    <section className="chapter final">
      <motion.button
        type="button"
        className="final__moon"
        onClick={poke}
        aria-label={found ? "the moon, smiling" : "the moon"}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: EASE }}
      >
        <motion.svg viewBox="0 0 100 100" width="100%" height="100%" animate={controls} aria-hidden="true">
          <defs>
            <radialGradient id="fullMoon" cx="38%" cy="36%" r="70%">
              <stop offset="0" stopColor="#f8f5ee" />
              <stop offset="0.7" stopColor="#e2ded2" />
              <stop offset="1" stopColor="#c9c5b9" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#fullMoon)" />
          {CRATERS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="rgba(120,118,140,0.13)" />
          ))}
          <AnimatePresence>
            {found && (
              <motion.g
                key="face"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE }}
                fill="none"
                stroke="#5a5c78"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M34 50 q4 -5 8 0" />
                <path d="M58 50 q4 -5 8 0" />
                <path d="M45 60 q5 4 10 0" />
                <circle cx="30" cy="58" r="3.5" fill="rgba(233,170,160,0.35)" stroke="none" />
                <circle cx="70" cy="58" r="3.5" fill="rgba(233,170,160,0.35)" stroke="none" />
              </motion.g>
            )}
          </AnimatePresence>
        </motion.svg>
      </motion.button>

      <div className="final__secret" aria-live="polite">
        <AnimatePresence>
          {found && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: EASE }}
            >
              {easterEgg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="final__message">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1 + i * 0.35, ease: EASE }}
          >
            {p}
          </motion.p>
        ))}
      </div>

      <motion.div
        className="final__foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6 + paragraphs.length * 0.35 }}
      >
        <button type="button" className="next" onClick={onRestart}>
          {text.finalRestart}
        </button>
        <p className="final__credit">
          made for {name.toLowerCase()}, by {from}
        </p>
      </motion.div>
    </section>
  );
}
