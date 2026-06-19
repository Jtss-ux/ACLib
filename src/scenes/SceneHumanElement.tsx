/**
 * Scene 3: The Human Element (0:12 – 0:20)
 * Close-up of a human eye with code scrolling in the pupil.
 * Circuit patterns radiate from the iris. Text: "EVOLVE WITH AI"
 * Dramatic zoom into the eye, then fade to black.
 */
import React from "react";
import { interpolate, spring } from "remotion";
import { COLORS, seededRandom, mapRange, CINEMATIC_SPRING } from "../utils";

interface SceneProps {
  frame: number;
  fps: number;
  width: number;
  height: number;
}

// Code lines to scroll in the pupil
const codeLines = [
  "import torch",
  "model = GPT(config)",
  "loss = F.cross_entropy()",
  "optimizer.step()",
  "attention = softmax(QK/√d)",
  "embed = nn.Embedding(V, D)",
  "for epoch in range(100):",
  "  output = model(input)",
  "  loss.backward()",
  "gradient_clip_(params, 1.0)",
  "lr = cosine_schedule(step)",
  "logits = head(hidden)",
  "tokens = tokenizer.encode()",
  "beam_search(model, k=5)",
  "reward = env.step(action)",
];

// Circuit path segments radiating from center
const circuitPaths = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const length = 200 + seededRandom(i * 4 + 300) * 400;
  const segments = Math.floor(2 + seededRandom(i * 4 + 301) * 3);
  const delay = seededRandom(i * 4 + 302) * 60;

  // Generate path with right-angle turns
  const points: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  let cx = 0;
  let cy = 0;
  const stepLen = length / segments;

  for (let s = 0; s < segments; s++) {
    const isHorizontal = s % 2 === 0;
    if (isHorizontal) {
      cx += Math.cos(angle) * stepLen;
      cy += Math.sin(angle) * stepLen;
    } else {
      // Perpendicular turn
      cx += Math.cos(angle + Math.PI / 2) * stepLen * 0.3;
      cy += Math.sin(angle + Math.PI / 2) * stepLen * 0.3;
    }
    points.push({ x: cx, y: cy });
  }

  return { points, delay };
});

export const SceneHumanElement: React.FC<SceneProps> = ({
  frame,
  fps,
  width,
  height,
}) => {
  const cx = width / 2;
  const cy = height / 2;

  // Dramatic zoom into the eye
  const zoom = interpolate(frame, [0, 480], [1, 2.5], {
    extrapolateRight: "clamp",
  });

  // Eye visibility
  const eyeOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Iris pulse
  const irisPulse = Math.sin(frame * 0.04) * 0.05 + 1;

  // Code scroll offset
  const codeScroll = frame * 1.8;

  // Text "EVOLVE WITH AI" using Cinematic Spring
  const textSpring = spring({
    frame: frame - 180,
    fps,
    config: CINEMATIC_SPRING,
  });
  const textOpacity = interpolate(frame, [180, 240, 420, 480], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Underline sweep
  const underlineWidth = interpolate(frame, [220, 300], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final fade to black
  const fadeToBlack = interpolate(frame, [420, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Circuit animation progress
  const circuitProgress = interpolate(frame, [40, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const irisOuterRadius = 320;
  const irisInnerRadius = 160;
  const pupilRadius = 120;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.void,
        overflow: "hidden",
      }}
    >
      {/* Zoom container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
          opacity: eyeOpacity,
        }}
      >
        {/* Eye SVG */}
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            {/* Iris gradient */}
            <radialGradient id="irisGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.void} />
              <stop offset="40%" stopColor="#0c1445" />
              <stop offset="65%" stopColor="#1e3a5f" />
              <stop offset="85%" stopColor={COLORS.neonBlue} stopOpacity="0.6" />
              <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0.3" />
            </radialGradient>

            {/* Pupil clip */}
            <clipPath id="pupilClip">
              <circle cx={cx} cy={cy} r={pupilRadius} />
            </clipPath>
          </defs>

          {/* SVG Filters - Replaced with CSS drop-shadow for stability */}


          {/* Eye white (sclera) - almond shape */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={550}
            ry={280}
            fill="#0d1117"
            stroke={COLORS.mercuryDark}
            strokeWidth={3}
            opacity={0.6}
          />

          {/* Iris outer ring */}
          <circle
            cx={cx}
            cy={cy}
            r={irisOuterRadius * irisPulse}
            fill="url(#irisGradient)"
            stroke={COLORS.neonBlue}
            strokeWidth={2}
            opacity={0.8}
          />

          {/* Iris detail rings */}
          {[0.95, 0.85, 0.7, 0.55].map((ratio, i) => (
            <circle
              key={`ring-${i}`}
              cx={cx}
              cy={cy}
              r={irisOuterRadius * ratio * irisPulse}
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth={0.8}
              opacity={0.15 + i * 0.05}
            />
          ))}

          {/* Iris fibrous lines */}
          {Array.from({ length: 36 }, (_, i) => {
            const angle = (i / 36) * Math.PI * 2;
            const innerR = irisInnerRadius * irisPulse;
            const outerR = irisOuterRadius * irisPulse * (0.85 + seededRandom(i) * 0.15);
            return (
              <line
                key={`fiber-${i}`}
                x1={cx + Math.cos(angle) * innerR}
                y1={cy + Math.sin(angle) * innerR}
                x2={cx + Math.cos(angle) * outerR}
                y2={cy + Math.sin(angle) * outerR}
                stroke={COLORS.neonBlue}
                strokeWidth={1}
                opacity={0.15 + seededRandom(i + 100) * 0.15}
              />
            );
          })}

          {/* Pupil */}
          <circle
            cx={cx}
            cy={cy}
            r={pupilRadius}
            fill={COLORS.void}
          />

          {/* Code scrolling in pupil */}
          <g clipPath="url(#pupilClip)">
            {codeLines.map((line, i) => {
              const lineY = cy - 80 + i * 22 - (codeScroll % (codeLines.length * 22));
              const wrapY = lineY + codeLines.length * 22;
              const finalY = lineY < cy - pupilRadius ? wrapY : lineY;

              // Simple "syntax highlighting" based on keywords
              const isKeyword = line.includes("import") || line.includes("for") || line.includes("def");
              const color = isKeyword ? COLORS.cyan : COLORS.mercuryLight;

              return (
                <text
                  key={`code-${i}`}
                  x={cx - pupilRadius + 15}
                  y={finalY}
                  fontSize={16}
                  fontWeight={isKeyword ? 600 : 400}
                  fontFamily="'Courier New', monospace"
                  fill={color}
                  opacity={0.6}
                >
                  {line}
                </text>
              );
            })}
            
            {/* Pupil Scanlines */}
            {Array.from({ length: 12 }, (_, i) => (
              <rect
                key={`scan-${i}`}
                x={cx - pupilRadius}
                y={cy - pupilRadius + i * 20}
                width={pupilRadius * 2}
                height={1}
                fill={COLORS.cyan}
                opacity={0.05}
              />
            ))}
          </g>

          {/* Pupil reflection highlight */}
          <circle
            cx={cx - 30}
            cy={cy - 30}
            r={25}
            fill="white"
            opacity={0.15}
            style={{ filter: "blur(4px)" }}
          />

          {/* Circuit traces radiating from iris */}
          {circuitPaths.map((circuit, i) => {
            const cProgress = mapRange(
              circuitProgress,
              circuit.delay / 200,
              circuit.delay / 200 + 0.4,
              0,
              1
            );
            if (cProgress <= 0) return null;

            const pathData = circuit.points
              .map((p, j) =>
                j === 0 ? `M ${cx + p.x} ${cy + p.y}` : `L ${cx + p.x} ${cy + p.y}`
              )
              .join(" ");

            return (
              <g key={`circuit-${i}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={COLORS.cyan}
                  strokeWidth={1.5}
                  opacity={cProgress * 0.4}
                  strokeDasharray={`${cProgress * 1000} 1000`}
                />
                {/* Terminal dot */}
                {cProgress > 0.8 && (
                  <circle
                    cx={cx + circuit.points[circuit.points.length - 1].x}
                    cy={cy + circuit.points[circuit.points.length - 1].y}
                    r={3}
                    fill={COLORS.cyan}
                    opacity={cProgress * 0.6}
                    style={{ filter: `drop-shadow(0 0 4px ${COLORS.cyanGlow})` }}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Text: EVOLVE WITH AI */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        <h2
          style={{
            fontSize: 160,
            fontWeight: 200,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            color: COLORS.chromeBright,
            letterSpacing: "0.25em",
            margin: 0,
            opacity: textOpacity,
            transform: `translateY(${interpolate(textSpring, [0, 1], [40, 0])}px)`,
            textShadow: `0 0 20px ${COLORS.cyanGlow}`, 
          }}
        >
          EVOLVE WITH AI
        </h2>
        {/* Sweeping underline */}
        <div
          style={{
            width: `${underlineWidth}%`,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)`,
            opacity: textOpacity,
            marginTop: 16,
          }}
        />
      </div>

      {/* Fade to black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "black",
          opacity: fadeToBlack,
          zIndex: 30,
        }}
      />
    </div>
  );
};
