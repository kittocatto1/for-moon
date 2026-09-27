import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { birthdayData } from "../data/birthday.js";
import { EASE, seeded } from "../lib.js";
import "./Cake.css";

const HEIGHTS = [34, 40, 36, 42, 37, 39, 35, 41];

// The glaze on the top tier, with drips along the front edge.
function glazePath(cx, cy, rx, ry) {
  const yAt = (x) => cy + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
  const lengths = [8, 15, 7, 19, 10, 6, 16, 9, 13, 7];
  let d = `M${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
  let i = 0;
  for (let x = cx + rx - 9; x > cx - rx + 6; x -= 14, i++) {
    const w = 10;
    const r = x + w / 2;
    const l = x - w / 2;
    const depth = lengths[i % lengths.length];
    d += ` L${r} ${yAt(r) + 3}`;
    d += ` C${r} ${yAt(x) + depth}, ${l} ${yAt(x) + depth}, ${l} ${yAt(l) + 3}`;
  }
  return `${d} L${cx - rx} ${cy + 1} Z`;
}

export default function Cake({ onNext }) {
  const { text, candles: candleCount = 5 } = birthdayData;
  const count = Math.max(1, Math.min(8, candleCount));
  const [lit, setLit] = useState(() => Array(count).fill(true));
  const [burst, setBurst] = useState(0);
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState(false);
  const pressing = useRef(false);
  const mic = useRef(null);

  const litCount = lit.filter(Boolean).length;
  const allOut = litCount === 0;

  const candles = useMemo(() => {
    const spread = Math.min(100, 24 * (count - 1));
    return Array.from({ length: count }, (_, i) => {
      const x = count === 1 ? 160 : 160 - spread / 2 + (i * spread) / (count - 1);
      const h = HEIGHTS[i % HEIGHTS.length];
      const base = 120 + (i % 2) * 2;
      return { x, h, base, top: base - h };
    });
  }, [count]);

  const blowOut = useCallback((i) => {
    setLit((prev) => {
      if (!prev[i]) return prev;
      const next = [...prev];
      next[i] = false;
      return next;
    });
  }, []);

  const blowRandom = useCallback(() => {
    setLit((prev) => {
      const on = prev.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
      if (!on.length) return prev;
      const next = [...prev];
      next[on[Math.floor(Math.random() * on.length)]] = false;
      return next;
    });
  }, []);

  const stopMic = useCallback(() => {
    const m = mic.current;
    if (!m) return;
    cancelAnimationFrame(m.raf);
    m.stream.getTracks().forEach((t) => t.stop());
    m.ctx.close?.();
    mic.current = null;
    setListening(false);
  }, []);

  const startMic = async () => {
    if (listening) return stopMic();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      let loud = 0;
      let last = 0;
      const tick = (t) => {
        if (!mic.current) return;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) sum += ((v - 128) / 128) ** 2;
        const rms = Math.sqrt(sum / data.length);
        if (rms > 0.14) {
          loud++;
          if (loud > 4 && t - last > 200) {
            blowRandom();
            last = t;
          }
        } else {
          loud = Math.max(0, loud - 1);
        }
        mic.current.raf = requestAnimationFrame(tick);
      };
      mic.current = { stream, ctx, raf: requestAnimationFrame(tick) };
      setListening(true);
      setMicError(false);
    } catch {
      setMicError(true);
    }
  };

  useEffect(() => () => stopMic(), [stopMic]);

  useEffect(() => {
    if (!allOut) return;
    stopMic();
    const t = setTimeout(() => setBurst((b) => b + 1), 650);
    return () => clearTimeout(t);
  }, [allOut, stopMic]);

  // Tap a candle, or press and swipe across several.
  const candleAt = (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const hit = el?.closest?.("[data-candle]");
    if (hit) blowOut(Number(hit.dataset.candle));
  };

  const relight = () => {
    setLit(Array(count).fill(true));
    setBurst(0);
  };

  return (
    <section
      className={`chapter cake${allOut ? " cake--done" : ""}`}
      style={{ "--glow": litCount / count }}
    >
      <p className="eyebrow">the cake</p>
      <h2 className="title">{text.cakeTitle}</h2>
      <p className="hint" aria-live="polite">
        {allOut ? " " : text.cakeHint}
      </p>

      <svg
        className="cake__svg"
        viewBox="0 0 320 290"
        role="group"
        aria-label={`a birthday cake with ${count} candles, ${litCount} still lit`}
        onPointerDown={(e) => {
          pressing.current = true;
          candleAt(e);
        }}
        onPointerMove={(e) => pressing.current && candleAt(e)}
        onPointerUp={() => (pressing.current = false)}
        onPointerCancel={() => (pressing.current = false)}
        onPointerLeave={() => (pressing.current = false)}
      >
        <defs>
          <linearGradient id="cakeSide" x1="0" x2="1">
            <stop offset="0" stopColor="#c9c3b4" />
            <stop offset="0.2" stopColor="#e5e0d3" />
            <stop offset="0.55" stopColor="#efebe1" />
            <stop offset="1" stopColor="#c2bcad" />
          </linearGradient>
          <radialGradient id="flame" cx="50%" cy="70%" r="65%">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="0.45" stopColor="#f6d796" />
            <stop offset="1" stopColor="#e0934a" />
          </radialGradient>
          <radialGradient id="halo">
            <stop offset="0" stopColor="rgba(246,215,150,0.45)" />
            <stop offset="1" stopColor="rgba(246,215,150,0)" />
          </radialGradient>
          <radialGradient id="warmth">
            <stop offset="0" stopColor="rgba(233,200,148,0.22)" />
            <stop offset="1" stopColor="rgba(233,200,148,0)" />
          </radialGradient>
          <pattern id="stripes" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="7" height="7" fill="#f4f0e2" />
            <rect width="2.4" height="7" fill="#e8cf7e" />
          </pattern>
          <mask id="crescentCut">
            <rect x="140" y="194" width="40" height="40" fill="white" />
            <circle cx="166" cy="209" r="10" fill="black" />
          </mask>
        </defs>

        {/* candlelight on the surroundings */}
        <ellipse
          className="cake__warmth"
          cx="160"
          cy="120"
          rx="160"
          ry="130"
          fill="url(#warmth)"
          style={{ opacity: litCount / count }}
        />

        {/* stand + plate */}
        <ellipse cx="160" cy="279" rx="34" ry="6" fill="#1c1f3a" />
        <rect x="146" y="260" width="28" height="19" fill="#20233f" />
        <ellipse cx="160" cy="258" rx="132" ry="16" fill="#252846" />
        <ellipse cx="160" cy="254" rx="128" ry="13" fill="#2f3358" />

        <g className="cake__body">
          {/* bottom tier */}
          <path d="M52 178 L52 246 A108 16 0 0 0 268 246 L268 178 Z" fill="url(#cakeSide)" />
          <ellipse cx="160" cy="178" rx="108" ry="16" fill="#f2eee5" />
          {/* crescent + tiny stars on the front */}
          <circle cx="158" cy="214" r="12" fill="#d9bc68" mask="url(#crescentCut)" />
          <circle cx="128" cy="206" r="1.6" fill="#d9bc68" />
          <circle cx="192" cy="224" r="1.3" fill="#d9bc68" />
          <circle cx="186" cy="202" r="1" fill="#d9bc68" />
          <circle cx="118" cy="226" r="1" fill="#d9bc68" />
          {/* pearls */}
          {Array.from({ length: 17 }, (_, i) => {
            const x = 62 + i * 12.25;
            const y = 246 + 16 * Math.sqrt(Math.max(0, 1 - ((x - 160) / 108) ** 2)) - 3;
            return <circle key={i} cx={x} cy={y} r="3.2" fill="#f6f3ec" stroke="#d6d1c4" strokeWidth="0.6" />;
          })}

          {/* top tier */}
          <path d="M90 120 L90 178 A70 11 0 0 0 230 178 L230 120 Z" fill="url(#cakeSide)" />
          <ellipse cx="160" cy="120" rx="70" ry="11" fill="#f2eee5" />
          <path d={glazePath(160, 120, 70, 11)} fill="#f2dd9c" />
          <ellipse cx="148" cy="116" rx="40" ry="4" fill="rgba(255,255,255,0.18)" />
        </g>

        {/* candles */}
        {candles.map((c, i) => (
          <g
            key={i}
            className={`candle${lit[i] ? "" : " candle--out"}`}
            data-candle={i}
            role="button"
            tabIndex={0}
            aria-label={lit[i] ? `candle ${i + 1}, lit. blow it out` : `candle ${i + 1}, out`}
            aria-pressed={!lit[i]}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                blowOut(i);
              }
            }}
          >
            {/* generous invisible hit area */}
            <rect x={c.x - 12} y={c.top - 40} width="24" height={c.h + 50} fill="transparent" />
            <rect x={c.x - 3.5} y={c.top} width="7" height={c.h} rx="1.5" fill="url(#stripes)" />
            <ellipse cx={c.x} cy={c.top} rx="3.5" ry="1.2" fill="#f0f0f6" />
            <line x1={c.x} y1={c.top} x2={c.x} y2={c.top - 5} stroke="#34354a" strokeWidth="1.2" strokeLinecap="round" />

            <g className="flame">
              <circle cx={c.x} cy={c.top - 14} r="22" fill="url(#halo)" />
              <g className="flame__shape" style={{ animationDelay: `${i * -0.37}s` }}>
                <path
                  d={`M${c.x} ${c.top - 3} C${c.x + 6} ${c.top - 3} ${c.x + 5} ${c.top - 14} ${c.x} ${c.top - 23} C${c.x - 5} ${c.top - 14} ${c.x - 6} ${c.top - 3} ${c.x} ${c.top - 3} Z`}
                  fill="url(#flame)"
                />
                <ellipse cx={c.x} cy={c.top - 6.5} rx="1.8" ry="2.6" fill="rgba(150,168,230,0.55)" />
              </g>
            </g>

            {!lit[i] && (
              <path
                className="smoke"
                d={`M${c.x} ${c.top - 5} c-4 -6 4 -10 0 -16 c-4 -6 4 -10 0 -16`}
                fill="none"
                stroke="#b9bdcc"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            )}
          </g>
        ))}
      </svg>

      <div className="cake__after">
        <AnimatePresence mode="wait">
          {allOut ? (
            <motion.div
              key="done"
              className="cake__done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: EASE }}
            >
              <p className="cake__done-text" role="status">{text.cakeDone}</p>
              <button type="button" className="small-button" onClick={relight}>
                {text.cakeRelight}
              </button>
            </motion.div>
          ) : (
            <motion.div key="mic" exit={{ opacity: 0 }} className="cake__mic">
              {typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia && (
                <button type="button" className="small-button" onClick={startMic} aria-pressed={listening}>
                  {listening ? "listening… blow!" : text.cakeMic}
                </button>
              )}
              {micError && <p className="cake__note">no mic access, tapping works just as well</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button type="button" className="next" onClick={onNext}>
        {text.cakeNext}
      </button>

      {burst > 0 && createPortal(<StarFall key={burst} />, document.body)}
    </section>
  );
}

// A gentle, one-time fall of small stars.
function StarFall() {
  const [done, setDone] = useState(false);
  const pieces = useMemo(() => {
    const rand = seeded(Date.now() % 100000);
    const colors = ["#ece8dc", "#c3c5d3", "#e9c894", "#a9a6d4"];
    return Array.from({ length: 34 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      size: 5 + rand() * 7,
      delay: rand() * 1.4,
      duration: 4.2 + rand() * 2.8,
      sway: (rand() - 0.5) * 80,
      spin: (rand() - 0.5) * 400,
      color: colors[Math.floor(rand() * colors.length)],
      star: rand() > 0.35,
    }));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 8000);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div className="starfall" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--sway": `${p.sway}px`,
            "--spin": `${p.spin}deg`,
          }}
        >
          <svg viewBox="-5 -5 10 10" width="100%" height="100%">
            {p.star ? (
              <path d="M0 -5 L1.1 -1.1 L5 0 L1.1 1.1 L0 5 L-1.1 1.1 L-5 0 L-1.1 -1.1 Z" fill={p.color} />
            ) : (
              <circle r="2.2" fill={p.color} />
            )}
          </svg>
        </span>
      ))}
    </div>
  );
}
