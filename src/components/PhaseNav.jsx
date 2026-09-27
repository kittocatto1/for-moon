import { motion } from "framer-motion";
import MoonPhase from "./MoonPhase.jsx";
import "./PhaseNav.css";

// Top progress indicator: the moon waxes as she moves through the chapters.
export default function PhaseNav({ chapters, current, visited, onGo }) {
  const steps = chapters.slice(1); // the opening screen isn't a phase
  return (
    <motion.nav
      className="phases"
      aria-label="chapters"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6 }}
    >
      <ol>
        {steps.map((label, i) => {
          const index = i + 1;
          const reachable = index <= visited;
          return (
            <li key={label}>
              <button
                type="button"
                className={`phase${index === current ? " phase--current" : ""}`}
                onClick={() => onGo(index)}
                disabled={!reachable}
                aria-current={index === current ? "step" : undefined}
                aria-label={reachable ? `go to ${label}` : `${label} (not yet)`}
              >
                <MoonPhase lit={index / steps.length} size={14} />
              </button>
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}
