/**
 * Scene 4: The Final Reveal (0:20 – 0:30)
 * Chrome text "AI WITH JTS" rises from liquid mercury.
 * Dramatic rim lighting, cyan light sweep, heartbeat pulse.
 * Subscribe icon fades in at the bottom.
 */
import React from "react";
import { interpolate, spring } from "remotion";
import { COLORS, seededRandom, mapRange, CINEMATIC_SPRING, LOGO_SPRING_CONFIG } from "../utils";

interface SceneProps {
  frame: number;
  fps: number;
  width: number;
  height: number;
}

// Floating particles
const NUM_DUST = 50;
const dustParticles = Array.from({ length: NUM_DUST }, (_, i) => ({
  x: seededRandom(i * 6 + 700) * 100,
  y: seededRandom(i * 6 + 701) * 100,
  size: 1 + seededRandom(i * 6 + 702) * 3,
  speed: 0.3 + seededRandom(i * 6 + 703) * 0.7,
  opacity: 0.05 + seededRandom(i * 6 + 704) * 0.15,
  drift: seededRandom(i * 6 + 705) * Math.PI * 2,
}));

// Mercury droplet positions
const mercuryDrops = Array.from({ length: 8 }, (_, i) => ({
  x: 30 + seededRandom(i * 3 + 800) * 40,
  size: 15 + seededRandom(i * 3 + 801) * 30,
  delay: seededRandom(i * 3 + 802) * 60,
}));

export const SceneLogoReveal: React.FC<SceneProps> = ({
  frame,
  fps,
  width,
  height,
}) => {
  const cx = width / 2;
  const cy = height / 2;

  // Logo rises from bottom using Logo Spring
  const logoRise = spring({
    frame: frame - 30,
    fps,
    config: LOGO_SPRING_CONFIG,
  });

  const logoY = interpolate(logoRise, [0, 1], [400, 0]);
  const logoOpacity = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Heartbeat pulse (starts after logo settles)
  const heartbeat =
    frame > 120
      ? Math.sin((frame - 120) * 0.15) * 0.02 + 1
      : 1;

  // Light sweep across the text
  const sweepX = interpolate(frame, [100, 200], [-120, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Second sweep for drama
  const sweep2X = interpolate(frame, [250, 350], [-120, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rim lighting intensity
  const rimIntensity = interpolate(frame, [60, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Mercury pool at bottom
  const mercuryOpacity = interpolate(frame, [0, 40], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subscribe icon using Cinematic Spring
  const subOpacity = interpolate(frame, [350, 420], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subScale = spring({
    frame: frame - 350,
    fps,
    config: CINEMATIC_SPRING,
  });

  // Background glow builds
  const bgGlow = interpolate(frame, [40, 150], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Impact flash at frame 60
  const impactFlash = interpolate(frame, [55, 60, 80], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lens flare
  const flareOpacity = interpolate(frame, [90, 130, 180], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flareX = interpolate(frame, [90, 180], [cx - 600, cx + 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      {/* Floating dust particles */}
      {dustParticles.map((p, i) => {
        const px = (p.x / 100) * width;
        const py = (p.y / 100) * height;
        const driftX = Math.sin(frame * 0.01 * p.speed + p.drift) * 30;
        const driftY = Math.cos(frame * 0.008 * p.speed + p.drift) * 20 - frame * 0.1 * p.speed;
        const pOp = mapRange(frame, 20, 80, 0, p.opacity);

        return (
          <div
            key={`dust-${i}`}
            style={{
              position: "absolute",
              left: px + driftX,
              top: py + driftY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: COLORS.cyan,
              opacity: pOp,
            }}
          />
        );
      })}

      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          left: cx - 900,
          top: cy - 500,
          width: 1800,
          height: 1000,
          background: `radial-gradient(ellipse at center, ${COLORS.neonBlueGlow} 0%, ${COLORS.neonBlueGlow}33 30%, transparent 70%)`,
          opacity: bgGlow,
        }}
      />

      {/* Mercury pool at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: height * 0.25,
          left: "10%",
          width: "80%",
          height: 200,
          background: `linear-gradient(180deg, transparent 0%, rgba(148, 163, 184, 0.08) 40%, rgba(148, 163, 184, 0.15) 100%)`,
          opacity: mercuryOpacity,
          borderRadius: "50% 50% 0 0",
        }}
      />

      {/* Mercury droplets */}
      {mercuryDrops.map((drop, i) => {
        const dropProgress = mapRange(frame, drop.delay, drop.delay + 40, 0, 1);
        if (dropProgress <= 0) return null;

        return (
          <div
            key={`drop-${i}`}
            style={{
              position: "absolute",
              left: `${drop.x}%`,
              bottom: height * 0.25 + 40 - dropProgress * 60,
              width: drop.size * dropProgress,
              height: drop.size * dropProgress * 0.6,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, rgba(203, 213, 225, 0.4), rgba(100, 116, 139, 0.2) 70%, transparent)`,
              opacity: mercuryOpacity * dropProgress,
            }}
          />
        );
      })}

      {/* Main logo container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {/* Logo text */}
        <div
          style={{
            transform: `translateY(${logoY}px) scale(${heartbeat})`,
            opacity: logoOpacity,
            position: "relative",
          }}
        >
          <h1
            style={{
              fontSize: 220,
              fontWeight: 900,
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
              color: "transparent",
              letterSpacing: "0.06em",
              margin: 0,
              lineHeight: 1.1,
              // Chrome / metallic text
              background: `linear-gradient(
                180deg,
                ${COLORS.chromeBright} 0%,
                ${COLORS.chrome} 25%,
                ${COLORS.mercuryDark} 50%,
                ${COLORS.chrome} 75%,
                ${COLORS.chromeBright} 100%
              )`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              // Rim lighting: Replaced drop-shadow with text-shadow for stability
              textShadow: `0 0 ${15 * rimIntensity}px ${COLORS.cyanGlow}`,
            }}
          >
            AI WITH JTS
          </h1>

          {/* Light sweep overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(
                90deg,
                transparent ${sweepX - 10}%,
                rgba(6, 182, 212, 0.3) ${sweepX}%,
                rgba(255, 255, 255, 0.5) ${sweepX + 2}%,
                rgba(6, 182, 212, 0.3) ${sweepX + 4}%,
                transparent ${sweepX + 14}%
              )`,
              mixBlendMode: "screen" as const,
              pointerEvents: "none" as const,
            }}
          />

          {/* Second sweep */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(
                90deg,
                transparent ${sweep2X - 8}%,
                rgba(59, 130, 246, 0.2) ${sweep2X}%,
                rgba(255, 255, 255, 0.4) ${sweep2X + 2}%,
                rgba(59, 130, 246, 0.2) ${sweep2X + 4}%,
                transparent ${sweep2X + 12}%
              )`,
              mixBlendMode: "screen" as const,
              pointerEvents: "none" as const,
            }}
          />

          {/* Reflection below text */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "100%",
              height: 120,
              background: `linear-gradient(
                180deg,
                ${COLORS.chromeBright}15 0%,
                transparent 100%
              )`,
              WebkitMaskImage:
                "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
              maskImage:
                "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
              transform: "scaleY(-0.4)",
              transformOrigin: "top",
              opacity: logoOpacity * 0.3,
            }}
          />
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 48,
            fontWeight: 300,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            color: COLORS.mercuryLight,
            letterSpacing: "0.5em",
            textTransform: "uppercase" as const,
            margin: 0,
            marginTop: 60,
            opacity: interpolate(frame, [200, 260], [0, 0.7], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          THE INTELLIGENCE HORIZON
        </p>

        {/* Subscribe button */}
        <div
          style={{
            marginTop: 120,
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: subOpacity,
            transform: `scale(${subScale})`,
          }}
        >
          {/* Play/Subscribe icon */}
          <svg width={60} height={60} viewBox="0 0 60 60">
            <rect
              x={5}
              y={5}
              width={50}
              height={50}
              rx={12}
              fill={COLORS.redAccent}
              opacity={0.9}
            />
            <polygon
              points="24,18 24,42 44,30"
              fill="white"
            />
          </svg>
          <span
            style={{
              fontSize: 36,
              fontWeight: 600,
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
              color: COLORS.chromeBright,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
            }}
          >
            SUBSCRIBE
          </span>
        </div>
      </div>

      {/* Lens flare */}
      <div
        style={{
          position: "absolute",
          left: flareX - 200,
          top: cy - 20,
          width: 400,
          height: 40,
          background: `linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.1) 20%, rgba(6, 182, 212, 0.6) 45%, rgba(255, 255, 255, 0.8) 50%, rgba(6, 182, 212, 0.6) 55%, rgba(6, 182, 212, 0.1) 80%, transparent 100%)`,
          opacity: flareOpacity,
          zIndex: 15,
        }}
      />

      {/* Small lens flare artifacts */}
      {[0.3, 0.5, 0.7].map((ratio, i) => (
        <div
          key={`flare-${i}`}
          style={{
            position: "absolute",
            left: cx + (flareX - cx) * ratio - 15,
            top: cy - 15,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent)`,
            opacity: flareOpacity * 0.5,
            zIndex: 15,
          }}
        />
      ))}

      {/* Impact flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.cyan,
          opacity: impactFlash,
          zIndex: 25,
          mixBlendMode: "screen" as const,
        }}
      />
    </div>
  );
};
