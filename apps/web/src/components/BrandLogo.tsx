/**
 * BrandBadge — Fixed bottom-right brand badge for the Shadow Broker app frame.
 *
 * Uses position:fixed so it is anchored to the iframe/viewport directly,
 * immune to parent container height, overflow, and flex layout issues.
 *
 * Offset from bottom by 56px (bottom-14) to clear any SSU blue status bar.
 *
 * Includes a text fallback ("SB / PROTOCOL") that is always rendered behind
 * the logo image. If the image fails to load for any reason, the branding
 * text remains clearly visible in orange on the dark badge background.
 */
import { useState } from 'react';

const BADGE_ACCENT = '#e8772e';

/** Resting glow — visible but restrained (Flappy Frontier reference values). */
const REST_SHADOW = [
  '0 2px 10px rgba(0,0,0,0.65)',
  '0 0 0 1px rgba(255,255,255,0.05)',
  '0 0 10px rgba(255,255,255,0.08)',
  `0 0 24px -4px ${BADGE_ACCENT}`,
].join(', ');

/** Hover: stronger glow, not excessive (Flappy Frontier reference values). */
const HOVER_SHADOW = [
  '0 4px 18px rgba(0,0,0,0.75)',
  '0 0 0 1px rgba(255,255,255,0.12)',
  '0 0 16px rgba(255,255,255,0.16)',
  `0 0 36px -4px ${BADGE_ACCENT}`,
].join(', ');

export function BrandBadge() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      style={{ position: 'fixed', bottom: 10, right: 16, zIndex: 9999 }}
      className="pointer-events-auto"
      aria-hidden="true"
    >
      <div className="group relative flex h-24 w-24 cursor-default items-center justify-center">
        {/* Glass background — 1px orange border, restrained glow at rest */}
        <span
          className="absolute inset-0 rounded-[10px] backdrop-blur-[3px]
                     transition-all duration-300"
          style={{
            background: 'rgba(0, 0, 0, 0.82)',
            border: `1px solid ${BADGE_ACCENT}`,
            boxShadow: REST_SHADOW,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = HOVER_SHADOW;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = REST_SHADOW;
          }}
        />

        {/* Text fallback — always rendered, visible if image fails */}
        <span
          className="pointer-events-none relative z-[1] flex select-none flex-col items-center justify-center"
          style={{ color: BADGE_ACCENT, fontFamily: 'JetBrains Mono, monospace' }}
        >
          <span className="text-2xl font-bold leading-none">SB</span>
          <span className="mt-0.5 text-[7px] font-medium uppercase tracking-[0.2em] leading-none">
            Protocol
          </span>
        </span>

        {/* Logo image — layered on top of text fallback */}
        {!imgFailed && (
          <span className="pointer-events-none absolute inset-0 z-[2] flex select-none items-center justify-center p-2.5">
            <img
              src="/assets/branding/shadow-broker-logo.png"
              alt=""
              className="pointer-events-none h-full w-full select-none object-contain"
              draggable={false}
              onError={() => setImgFailed(true)}
            />
          </span>
        )}
      </div>
    </div>
  );
}
