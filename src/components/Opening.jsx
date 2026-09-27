import { motion } from "framer-motion";
import Crescent from "./Crescent.jsx";
import { birthdayData } from "../data/birthday.js";
import { EASE } from "../lib.js";
import "./Opening.css";

export default function Opening({ onNext }) {
  const { text } = birthdayData;
  const words = text.opening.split(" ");

  return (
    <section className="chapter opening">
      <motion.div
        className="opening__moon"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: EASE }}
      >
        <Crescent size={44} />
      </motion.div>

      <h1 className="opening__text">
        {words.map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 + i * 0.28, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </h1>

      <motion.button
        type="button"
        className="next opening__button"
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.9 + words.length * 0.28 + 0.6 }}
      >
        {text.openingButton}
      </motion.button>
    </section>
  );
}
