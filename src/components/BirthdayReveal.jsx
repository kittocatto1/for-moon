import { motion } from "framer-motion";
import Crescent from "./Crescent.jsx";
import { birthdayData } from "../data/birthday.js";
import { EASE } from "../lib.js";
import "./BirthdayReveal.css";

export default function BirthdayReveal({ onNext }) {
  const { name, text } = birthdayData;
  const letters = Array.from(`${name} (˶ᵔ ᵕ ᵔ˶)`);
  const nameStart = 1.5;

  return (
    <section className="chapter reveal">
      <motion.div
        className="reveal__moon"
        initial={{ opacity: 0, scale: 0.9, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <Crescent size={132} />
      </motion.div>

      <h1 className="reveal__title">
        <motion.span
          className="reveal__line"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
        >
          {text.revealLine}
        </motion.span>
        <span className="reveal__name" aria-label={`${name} <3 `}>
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: nameStart + i * 0.09, ease: EASE }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </span>
      </h1>

      {/* one shooting star, once */}
      <span className="shooting-star" aria-hidden="true" />

      <motion.button
        type="button"
        className="next"
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: nameStart + letters.length * 0.09 + 1 }}
      >
        {text.revealNext}
      </motion.button>
    </section>
  );
}
