import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Photo from "./Photo.jsx";
import { birthdayData } from "../data/birthday.js";
import { EASE } from "../lib.js";
import "./Memories.css";

// Default tilt for each polaroid; a memory can override it with `rotate`.
const TILTS = [-3.5, 2.5, -1.5, 4, -2.5, 1.5, -4, 3, -2, 2.8];

export default function Memories({ onNext }) {
  const { memories, text } = birthdayData;
  const [open, setOpen] = useState(null);
  const openerRef = useRef(null);

  const show = (i, el) => {
    openerRef.current = el;
    setOpen(i);
  };

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section className="chapter chapter--top memories">
      <p className="eyebrow">memories</p>
      <h2 className="title">{text.memoriesTitle}</h2>
      <p className="hint">{text.memoriesHint}</p>

      <ul className="polaroids">
        {memories.map((m, i) => {
          const tilt = m.rotate ?? TILTS[i % TILTS.length];
          const alt = m.alt || `photo ${i + 1}`;
          return (
            <motion.li
              key={m.image + i}
              initial={{ opacity: 0, y: 40, rotate: tilt * 2.2 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.1, ease: EASE, delay: (i % 3) * 0.12 }}
            >
              <button
                type="button"
                className="polaroid"
                onClick={(e) => show(i, e.currentTarget)}
                aria-label={`open ${alt}`}
              >
                <span className="polaroid__frame">
                  <Photo src={m.image} alt={alt} className="polaroid__img" />
                </span>
                <span className="polaroid__no" aria-hidden="true">
                  no. {i + 1}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      <button type="button" className="next" onClick={onNext}>
        {text.memoriesNext}
      </button>

      {createPortal(
        <AnimatePresence>
          {open !== null && (
            <Lightbox
              key="lightbox"
              memories={memories}
              index={open}
              setIndex={setOpen}
              onClose={close}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

function Lightbox({ memories, index, setIndex, onClose }) {
  const closeRef = useRef(null);
  const [dir, setDir] = useState(0);
  const count = memories.length;
  const m = memories[index];
  const alt = m.alt || `photo ${index + 1}`;

  const step = useCallback(
    (d) => {
      setDir(d);
      setIndex((i) => (i + d + count) % count);
    },
    [count, setIndex]
  );

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, step]);

  return (
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt}, ${index + 1} of ${count}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label="close photo">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.figure
          key={index}
          className="lightbox__card"
          custom={dir}
          initial={{ opacity: 0, scale: 0.94, x: dir * 40, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, x: 0, rotate: -0.8 }}
          exit={{ opacity: 0, scale: 0.97, x: dir * -40 }}
          transition={{ duration: 0.5, ease: EASE }}
          drag={count > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) step(1);
            else if (info.offset.x > 60) step(-1);
          }}
        >
          <div className="lightbox__photo">
            <Photo src={m.image} alt={alt} fit="contain" className="lightbox__img" />
          </div>
          <figcaption className="lightbox__caption">{m.caption}</figcaption>
        </motion.figure>
      </AnimatePresence>

      {count > 1 && (
        <div className="lightbox__nav">
          <button type="button" className="lightbox__arrow" onClick={() => step(-1)} aria-label="previous photo">
            ‹
          </button>
          <span className="lightbox__count" aria-hidden="true">
            {index + 1} / {count}
          </span>
          <button type="button" className="lightbox__arrow" onClick={() => step(1)} aria-label="next photo">
            ›
          </button>
        </div>
      )}
    </motion.div>
  );
}
