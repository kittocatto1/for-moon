import { motion } from "framer-motion";
import MoonPhase from "./MoonPhase.jsx";
import { birthdayData } from "../data/birthday.js";
import { EASE, toParagraphs } from "../lib.js";
import "./Letter.css";

// Your letter. The text itself comes from src/data/birthday.js → message.
export default function Letter({ onNext }) {
  const { name, from, message, text } = birthdayData;
  const paragraphs = toParagraphs(message);

  const reveal = {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -8% 0px" },
    transition: { duration: 1, ease: EASE },
  };

  return (
    <section className="chapter chapter--top letter-wrap">
      <motion.div
        className="letter-stack"
        initial={{ opacity: 0, y: 24, rotate: -0.6 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
      >
        <div className="letter__under" aria-hidden="true" />
        <article className="letter">
          <div className="letter__stamp" aria-hidden="true">
            <MoonPhase lit={0.28} size={30} dark="transparent" />
          </div>

          <p className="letter__greeting">{name},</p>

          <div className="letter__body">
            {paragraphs.map((p, i) => (
              <motion.p key={i} {...reveal}>
                {p}
              </motion.p>
            ))}
          </div>

          <motion.p className="letter__sign" {...reveal}>
            — {from}
          </motion.p>
        </article>
      </motion.div>

      <button type="button" className="next" onClick={onNext}>
        {text.letterNext}
      </button>
    </section>
  );
}
