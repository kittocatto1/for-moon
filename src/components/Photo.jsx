import { useState } from "react";
import Crescent from "./Crescent.jsx";
import { assetUrl } from "../lib.js";

// An image that quietly becomes a placeholder card if the file isn't there yet.
export default function Photo({ src, alt, className = "", fit = "cover" }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={`photo-fallback ${className}`} role="img" aria-label={alt}>
        <Crescent size={34} glow={false} />
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={assetUrl(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable="false"
      style={{ objectFit: fit }}
      onError={() => setFailed(true)}
    />
  );
}
