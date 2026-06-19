/**
 * Scene 1: The Awakening (0:00 – 0:05)
 * A dark void. A single point of light explodes into glowing neural pathways.
 * Camera pushes forward through the web. Text: "THE FUTURE"
 */
import React from "react";
import { interpolate, spring } from "remotion";
import { COLORS, seededRandom, easeOutExpo, mapRange, CINEMATIC_SPRING } from "../utils";

interface SceneProps {
  frame: number;
  fps: number;
  width: number;
  height: number;
}

// Pre-generate neural network nodes and edges
const NUM_NODES = 40;
const nodes = Array.from({ length: NUM_NODES }, (_, i) => ({
  x: seededRandom(i * 3 + 100) * 3200 - 1600,
  y: seededRandom(i * 3 + 101) * 1800 - 900,
  size: 3 + seededRandom(i * 3 + 102) * 8,
  delay: seededRandom(i * 3 + 103) * 120,
}));

// Generate edges between nearby nodes
const edges: { from: number; to: number; delay: number }[] = [];
for (let i = 0; i < NUM_NODES; i++) {
  for (let j = i + 1; j < NUM_NODES; j++) {
    const dx = nodes[i].x - nodes[j].x;
    const dy = nodes[i].y - nodes[j].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 600 && edges.length < 80) {
      edges.push({
        from: i,
        to: j,
        delay: Math.min(nodes[i].delay, nodes[j].delay) + 10,
      });
    }
  }
}

// Particle bursts
const NUM_PARTICLES = 60;
const particles = Array.from({ length: NUM_PARTICLES }, (_, i) => ({
  angle: seededRandom(i * 5 + 200) * Math.PI * 2,
  speed: 2 + seededRandom(i * 5 + 201) * 6,
  size: 2 + seededRandom(i * 5 + 202) * 4,
  delay: seededRandom(i * 5 + 203) * 40,
  life: 60 + seededRandom(i * 5 + 204) * 120,
}));

export const SceneAwakening: React.FC<SceneProps> = ({
  frame,
  fps,
  width,
  height,
}) => {
  const cx = width / 2;
  const cy = height / 2;

  // Initial flash
  const flashOpacity = interpolate(frame, [0, 8, 25], [0, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Central light point
  const pointScale = interpolate(frame, [0, 5, 40], [0, 0.3, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Camera push-forward (zoom)
  const cameraZoom = interpolate(frame, [0, 300], [1, 1.6], {
    extrapolateRight: "clamp",
  });

  // Background glow
  const glowOpacity = interpolate(frame, [10, 80], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text reveal for "THE FUTURE" using Cinematic Spring
  const textSpring = spring({
    frame: frame - 120,
    fps,
    config: CINEMATIC_SPRING,
  });
  const textProgress = textSpring;
  const textOpacity = interpolate(frame, [120, 160, 260, 300], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text = "THE FUTURE";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.void,
        overflow: "hidden",
      }}
    >
      {/* Camera zoom container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraZoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* Background radial glow */}
        <div
          style={{
            position: "absolute",
            left: cx - 800,
            top: cy - 800,
            width: 1600,
            height: 1600,
            borderRadius: "50%",
            background: `radial-gradient(circle at center, ${COLORS.cyanGlow} 0%, ${COLORS.neonBlueGlow} 30%, transparent 70%)`,
            opacity: glowOpacity,
          }}
        />

        {/* Neural network SVG */}
        <svg
          width={width}
          height={height}
          viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
          style={{ position: "absolute", inset: 0 }}
        >
          {/* Edges */}
          {edges.map((edge, i) => {
            const progress = mapRange(frame, edge.delay, edge.delay + 40, 0, 1);
            const edgeOpacity = easeOutExpo(progress);
            if (edgeOpacity <= 0) return null;

            const n1 = nodes[edge.from];
            const n2 = nodes[edge.to];

            // Pulse traveling along edge
            const pulsePos = mapRange(
              (frame - edge.delay) % 80,
              0,
              80,
              0,
              1
            );

            return (
              <g key={`e-${i}`}>
                <line
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke={COLORS.cyan}
                  strokeWidth={1.5}
                  opacity={edgeOpacity * 0.4}
                />
                {/* Traveling pulse dot */}
                {edgeOpacity > 0.5 && (
                  <circle
                    cx={n1.x + (n2.x - n1.x) * pulsePos}
                    cy={n1.y + (n2.y - n1.y) * pulsePos}
                    r={3}
                    fill={COLORS.cyan}
                    opacity={0.8}
                    style={{ filter: `drop-shadow(0 0 4px ${COLORS.cyanGlow})` }}
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const nodeProgress = mapRange(
              frame,
              node.delay,
              node.delay + 30,
              0,
              1
            );
            const nodeScale = easeOutExpo(nodeProgress);
            if (nodeScale <= 0) return null;

            return (
              <g key={`n-${i}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size * nodeScale}
                  fill={COLORS.cyan}
                  opacity={0.7}
                  style={{ filter: `drop-shadow(0 0 6px ${COLORS.cyanGlow})` }}
                />
                {/* Outer ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size * nodeScale * 2}
                  fill="none"
                  stroke={COLORS.cyan}
                  strokeWidth={0.8}
                  opacity={0.2}
                />
              </g>
            );
          })}

          {/* SVG Filters - Removed heavy Gaussian Blurs for stability */}

        </svg>

        {/* Particle burst from center */}
        {particles.map((p, i) => {
          const pFrame = frame - p.delay;
          if (pFrame < 0 || pFrame > p.life) return null;
          const t = pFrame / p.life;
          const x = cx + Math.cos(p.angle) * p.speed * pFrame;
          const y = cy + Math.sin(p.angle) * p.speed * pFrame;
          const opacity = 1 - t;

          return (
            <div
              key={`p-${i}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                backgroundColor: COLORS.cyan,
                opacity: opacity * 0.6,
                boxShadow: `0 0 ${p.size * 2}px ${COLORS.cyanGlow}`,
              }}
            />
          );
        })}

        {/* Central light point */}
        <div
          style={{
            position: "absolute",
            left: cx - 40,
            top: cy - 40,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `radial-gradient(circle at center, white 0%, ${COLORS.cyan} 40%, ${COLORS.cyan}00 70%)`,
            transform: `scale(${pointScale})`,
            boxShadow: `0 0 30px 10px ${COLORS.cyanGlow}`, 
          }}
        />
      </div>

      {/* Flash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "white",
          opacity: flashOpacity,
        }}
      />

      {/* Text overlay: THE FUTURE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            opacity: textOpacity,
            position: "relative",
          }}
        >
          {text.split("").map((char, i) => {
            const charDelay = i * 0.08;
            const charProgress = mapRange(
              textProgress,
              charDelay,
              charDelay + 0.3,
              0,
              1
            );
            const charY = interpolate(charProgress, [0, 1], [60, 0]);
            const charOp = interpolate(charProgress, [0, 1], [0, 1]);

            return (
              <span
                key={i}
                style={{
                  fontSize: 180,
                  fontWeight: 200,
                  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                  color: COLORS.chromeBright,
                  letterSpacing: "0.3em",
                  transform: `translateY(${charY}px)`,
                  opacity: charOp,
                  textShadow: `0 0 20px ${COLORS.cyanGlow}`, // Simplified shadow
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}

          {/* Chromatic Aberration Overlay for Text */}
          {textOpacity > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                gap: 20,
                opacity: textOpacity * 0.4,
                mixBlendMode: "screen",
                pointerEvents: "none",
                transform: `translateX(${Math.sin(frame * 0.2) * 4}px)`,
              }}
            >
              {text.split("").map((char, i) => (
                <span
                  key={`ca-${i}`}
                  style={{
                    fontSize: 180,
                    fontWeight: 200,
                    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                    color: "#ff0080",
                    letterSpacing: "0.3em",
                    filter: "blur(2px)",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
