import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Sky from "./components/Sky.jsx";
import PhaseNav from "./components/PhaseNav.jsx";
import Opening from "./components/Opening.jsx";
import BirthdayReveal from "./components/BirthdayReveal.jsx";
import Letter from "./components/Letter.jsx";
import Memories from "./components/Memories.jsx";
import Cake from "./components/Cake.jsx";
import Flowers from "./components/Flowers.jsx";
import FinalReveal from "./components/FinalReveal.jsx";
import { EASE } from "./lib.js";

// The journey, in order. Each one is shown on its own, like turning a page.
const CHAPTERS = [
  { name: "the beginning", Component: Opening },
  { name: "happy birthday", Component: BirthdayReveal },
  { name: "the letter", Component: Letter },
  { name: "memories", Component: Memories },
  { name: "cake", Component: Cake },
  { name: "flowers", Component: Flowers },
  { name: "the end", Component: FinalReveal },
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState(0);
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  const go = (i) => {
    const next = Math.max(0, Math.min(CHAPTERS.length - 1, i));
    setIndex(next);
    setVisited((v) => Math.max(v, next));
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Move keyboard/screen-reader focus to the new chapter once it has appeared.
    const t = setTimeout(() => mainRef.current?.focus({ preventScroll: true }), 1000);
    return () => clearTimeout(t);
  }, [index]);

  const { Component } = CHAPTERS[index];

  return (
    <MotionConfig reducedMotion="user">
      <Sky dim={index === 0} />
      {index > 0 && (
        <PhaseNav
          chapters={CHAPTERS.map((c) => c.name)}
          current={index}
          visited={visited}
          onGo={go}
        />
      )}
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          key={index}
          ref={mainRef}
          tabIndex={-1}
          style={{ outline: "none" }}
          aria-label={CHAPTERS[index].name}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.55, ease: EASE } }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Component onNext={() => go(index + 1)} onRestart={() => { setVisited(0); go(0); }} />
        </motion.main>
      </AnimatePresence>
    </MotionConfig>
  );
}
