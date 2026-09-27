import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthdayData } from "../data/birthday.js";
import { EASE } from "../lib.js";
import "./Flowers.css";

const KINDS = {
  moonflower: { petals: 5, length: 34, width: 24, base: "#c9cae3", tip: "#f7f4ec", center: "#e9c894" },
  cosmos: { petals: 8, length: 30, width: 9, base: "#7c78b3", tip: "#c9c5e8", center: "#e9c894" },
  starling: { petals: 6, length: 21, width: 13, base: "#d3b286", tip: "#f4e6cc", center: "#8d8bc2" },
};

// The bouquet: where each head sits, and how its stem bends toward the tie.
const BOUQUET = [
  { kind: "cosmos", x: 98, y: 150, bend: -30, leaf: 0.55 },
  { kind: "starling", x: 136, y: 230, bend: -10 },
  { kind: "moonflower", x: 182, y: 96, bend: 8, leaf: 0.45, big: true },
  { kind: "starling", x: 232, y: 222, bend: 12, leaf: 0.5 },
  { kind: "moonflower", x: 266, y: 150, bend: 28 },
];

const TIE = { x: 182, y: 330 };

function petalPath(l, w) {
  return `M0 0 C${-w} ${-l * 0.28} ${-w * 0.72} ${-l} 0 ${-l} C${w * 0.72} ${-l} ${w} ${-l * 0.28} 0 0 Z`;
}

export default function Flowers({ onNext }) {
  const { text } = birthdayData;
  const [open, setOpen] = useState(() => BOUQUET.map(() => false));
  const allOpen = open.every(Boolean);

  const bloom = (i) =>
    setOpen((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });

  return (
    <section className="chapter flowers">
      <p className="eyebrow">{text.flowersEyebrow}</p>
      <h2 className="title flowers__title">{text.flowersTitle}</h2>
      <p className="hint">{allOpen ? " " : text.flowersHint}</p>

      <svg className="flowers__svg" viewBox="0 0 364 400" role="group" aria-label="a bouquet of flower buds">
        <defs>
          {Object.entries(KINDS).map(([name, k]) => (
            <linearGradient key={name} id={`petal-${name}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={k.base} />
              <stop offset="1" stopColor={k.tip} />
            </linearGradient>
          ))}
          <radialGradient id="budHalo">
            <stop offset="0" stopColor="rgba(236,232,220,0.14)" />
            <stop offset="1" stopColor="rgba(236,232,220,0)" />
          </radialGradient>
        </defs>

        {/* stems + leaves */}
        <g className="stems">
          {BOUQUET.map((f, i) => {
            const cx = (f.x + TIE.x) / 2 + f.bend;
            const cy = (f.y + TIE.y) / 2;
            const t = f.leaf;
            // point on the stem for a leaf
            const lx = t && (1 - t) ** 2 * f.x + 2 * (1 - t) * t * cx + t ** 2 * TIE.x;
            const ly = t && (1 - t) ** 2 * f.y + 2 * (1 - t) * t * cy + t ** 2 * TIE.y;
            const side = f.x < TIE.x ? -1 : 1;
            return (
              <g key={i}>
                <path
                  d={`M${f.x} ${f.y} Q${cx} ${cy} ${TIE.x} ${TIE.y} L${TIE.x + (i - 2) * 3} ${TIE.y + 52}`}
                  fill="none"
                  stroke="#6c8176"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {t && (
                  <path
                    d={`M0 0 C${6 * side} -8 ${20 * side} -10 ${28 * side} -6 C${20 * side} 2 ${8 * side} 4 0 0 Z`}
                    transform={`translate(${lx} ${ly})`}
                    fill="#5d7266"
                  />
                )}
              </g>
            );
          })}
          {/* ribbon */}
          <g transform={`translate(${TIE.x} ${TIE.y + 6})`} fill="none" stroke="#c3c5d3" strokeWidth="1.4" strokeLinecap="round">
            <path d="M0 0 C-10 -10 -22 -4 -14 4 C-8 9 -3 4 0 0" />
            <path d="M0 0 C10 -10 22 -4 14 4 C8 9 3 4 0 0" />
            <path d="M-1 1 L-9 22 M1 1 L7 24" />
          </g>
        </g>

        {BOUQUET.map((f, i) => (
          <Flower key={i} {...f} open={open[i]} onBloom={() => bloom(i)} index={i} />
        ))}
      </svg>

      <div className="flowers__after">
        <AnimatePresence>
          {allOpen && (
            <motion.p
              className="flowers__done"
              role="status"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.2, ease: EASE }}
            >
              {text.flowersDone}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <button type="button" className="next" onClick={onNext}>
        {text.flowersNext}
      </button>
    </section>
  );
}

function Flower({ kind, x, y, big, open, onBloom, index }) {
  const k = KINDS[kind];
  const scale = big ? 1.15 : 1;
  const step = 360 / k.petals;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g
        className={`flower${open ? " flower--open" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={open ? `flower ${index + 1}, in bloom` : `flower bud ${index + 1}. open it`}
        aria-pressed={open}
        onClick={onBloom}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onBloom();
          }
        }}
      >
        <circle className="flower__hit" r="42" fill="transparent" />
        <circle className="flower__halo" r="30" fill="url(#budHalo)" />

        {/* sepals */}
        {[-1, 1].map((s) => (
          <path
            key={s}
            className="sepal"
            style={{ "--s": s }}
            d={`M0 2 C${s * 7} -2 ${s * 8} -10 ${s * 3} -16 C${s * 2} -8 ${s * 1} -3 0 2 Z`}
            fill="#5d7266"
          />
        ))}

        <g className="petals">
          {Array.from({ length: k.petals }, (_, p) => {
            let a = p * step;
            if (a > 180) a -= 360;
            return (
              <path
                key={p}
                className="petal"
                d={petalPath(k.length, k.width)}
                fill={`url(#petal-${kind})`}
                stroke="rgba(20,22,40,0.12)"
                strokeWidth="0.6"
                style={{
                  "--a": `${a}deg`,
                  "--c": `${a * 0.07}deg`,
                  "--d": `${Math.abs(a) / 180 * 0.35}s`,
                }}
              />
            );
          })}
        </g>

        <circle className="flower__center" r={k.width > 15 ? 5 : 4} fill={k.center} />
        <circle className="flower__center flower__center--dot" r="1.4" fill="rgba(35,37,58,0.35)" />

        <path
          className="flower__sparkle"
          d="M0 -5 L1.1 -1.1 L5 0 L1.1 1.1 L0 5 L-1.1 1.1 L-5 0 L-1.1 -1.1 Z"
          transform={`translate(${k.length * 0.9} ${-k.length * 0.9})`}
          fill="#ece8dc"
        />
      </g>
    </g>
  );
}
