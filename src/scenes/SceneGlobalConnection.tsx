/**
 * Scene 2: The Global Connection (0:05 – 0:12)
 * Neural pathways wrap around a 3D wireframe globe.
 * Cities light up as data centers. Text: "IS HERE"
 */
import React from "react";
import { interpolate, spring } from "remotion";
import { COLORS, seededRandom, mapRange, easeOutExpo, CINEMATIC_SPRING } from "../utils";

interface SceneProps {
  frame: number;
  fps: number;
  width: number;
  height: number;
}

// City locations (approximate lat/lon mapped to spherical coordinates)
const cities = [
  { name: "NYC", lat: 40.7, lon: -74, delay: 20 },
  { name: "London", lat: 51.5, lon: 0, delay: 40 },
  { name: "Tokyo", lat: 35.7, lon: 139.7, delay: 60 },
  { name: "Sydney", lat: -33.9, lon: 151.2, delay: 80 },
  { name: "Mumbai", lat: 19.1, lon: 72.9, delay: 100 },
  { name: "SFO", lat: 37.8, lon: -122.4, delay: 30 },
  { name: "Dubai", lat: 25.2, lon: 55.3, delay: 70 },
  { name: "Singapore", lat: 1.35, lon: 103.8, delay: 90 },
  { name: "Berlin", lat: 52.5, lon: 13.4, delay: 50 },
  { name: "Seoul", lat: 37.6, lon: 127, delay: 110 },
  { name: "Lagos", lat: 6.5, lon: 3.4, delay: 120 },
  { name: "São Paulo", lat: -23.5, lon: -46.6, delay: 130 },
];

// Data stream connections between cities
const connections = [
  [0, 1], [0, 5], [1, 8], [1, 6], [2, 7], [2, 9],
  [3, 7], [4, 6], [4, 7], [5, 2], [8, 9], [10, 1],
  [11, 0], [10, 4], [3, 11],
];

function latLonToSphere(
  lat: number,
  lon: number,
  radius: number,
  rotation: number
): { x: number; y: number; z: number } {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + rotation) * Math.PI) / 180;
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: -radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

export const SceneGlobalConnection: React.FC<SceneProps> = ({
  frame,
  fps,
  width,
  height,
}) => {
  const cx = width / 2;
  const cy = height / 2;
  const globeRadius = Math.min(width, height) * 0.28;

  // Globe rotation (180 degrees over the scene)
  const rotation = interpolate(frame, [0, 420], [0, 180], {
    extrapolateRight: "clamp",
  });

  // Globe fade in
  const globeOpacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Globe scale (slight zoom out)
  const globeScale = interpolate(frame, [0, 60], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text "IS HERE" using Cinematic Spring
  const textSpring = spring({
    frame: frame - 180,
    fps,
    config: CINEMATIC_SPRING,
  });
  const textOpacity = interpolate(frame, [180, 240, 380, 420], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textX = interpolate(textSpring, [0, 1], [100, 0]);

  // Generate latitude lines
  const latLines: React.ReactNode[] = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    const points: string[] = [];
    for (let lon = 0; lon <= 360; lon += 5) {
      const p = latLonToSphere(lat, lon, globeRadius, rotation);
      if (p.z > -globeRadius * 0.1) {
        points.push(`${cx + p.x},${cy + p.y}`);
      }
    }
    if (points.length > 1) {
      latLines.push(
        <polyline
          key={`lat-${lat}`}
          points={points.join(" ")}
          fill="none"
          stroke={COLORS.neonBlue}
          strokeWidth={1.2}
          opacity={0.25}
        />
      );
    }
  }

  // Generate longitude lines
  const lonLines: React.ReactNode[] = [];
  for (let lon = 0; lon < 360; lon += 20) {
    const points: string[] = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const p = latLonToSphere(lat, lon, globeRadius, rotation);
      if (p.z > -globeRadius * 0.1) {
        points.push(`${cx + p.x},${cy + p.y}`);
      }
    }
    if (points.length > 1) {
      lonLines.push(
        <polyline
          key={`lon-${lon}`}
          points={points.join(" ")}
          fill="none"
          stroke={COLORS.neonBlue}
          strokeWidth={1}
          opacity={0.2}
        />
      );
    }
  }

  // City dots
  const cityDots = cities.map((city, i) => {
    const p = latLonToSphere(city.lat, city.lon, globeRadius, rotation);
    if (p.z < -globeRadius * 0.05) return null; // behind globe

    const cityProgress = mapRange(frame, city.delay, city.delay + 30, 0, 1);
    const cityScale = easeOutExpo(cityProgress);

    // Pulse effect
    const pulse = Math.sin((frame - city.delay) * 0.08) * 0.3 + 0.7;

    return (
      <g key={`city-${i}`}>
        {/* Outer pulse ring */}
        <circle
          cx={cx + p.x}
          cy={cy + p.y}
          r={14 * cityScale * pulse}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={1.5}
          opacity={cityScale * 0.4}
        />
        {/* City dot */}
        <circle
          cx={cx + p.x}
          cy={cy + p.y}
          r={6 * cityScale}
          fill={COLORS.cyan}
          opacity={cityScale * 0.9}
          style={{ filter: `drop-shadow(0 0 6px ${COLORS.cyanGlow})` }}
        />
      </g>
    );
  });

  // Data connections between cities
  const dataStreams = connections.map(([fromIdx, toIdx], i) => {
    const from = cities[fromIdx];
    const to = cities[toIdx];
    const p1 = latLonToSphere(from.lat, from.lon, globeRadius, rotation);
    const p2 = latLonToSphere(to.lat, to.lon, globeRadius, rotation);

    // Only show if both cities face forward
    if (p1.z < -globeRadius * 0.05 || p2.z < -globeRadius * 0.05) return null;

    const streamDelay = Math.max(from.delay, to.delay) + 20;
    const streamProgress = mapRange(frame, streamDelay, streamDelay + 40, 0, 1);
    if (streamProgress <= 0) return null;

    // Animated dash
    const dashOffset = -(frame - streamDelay) * 3;

    return (
      <line
        key={`stream-${i}`}
        x1={cx + p1.x}
        y1={cy + p1.y}
        x2={cx + p2.x}
        y2={cy + p2.y}
        stroke={COLORS.cyan}
        strokeWidth={1.5}
        opacity={streamProgress * 0.5}
        strokeDasharray="8 12"
        strokeDashoffset={dashOffset}
      />
    );
  });

  // Background particles
  const bgParticles = Array.from({ length: 30 }, (_, i) => {
    const px = seededRandom(i * 7 + 500) * width;
    const py = seededRandom(i * 7 + 501) * height;
    const pSize = 1 + seededRandom(i * 7 + 502) * 3;
    const pOp = 0.1 + seededRandom(i * 7 + 503) * 0.2;
    const drift = Math.sin(frame * 0.02 + i) * 10;

    return (
      <div
        key={`bg-${i}`}
        style={{
          position: "absolute",
          left: px,
          top: py + drift,
          width: pSize,
          height: pSize,
          borderRadius: "50%",
          backgroundColor: COLORS.neonBlue,
          opacity: pOp,
        }}
      />
    );
  });

  // Bokeh particles (large, out-of-focus background elements)
  const bokehParticles = Array.from({ length: 15 }, (_, i) => {
    const size = 150 + seededRandom(i * 12 + 600) * 300;
    const px = seededRandom(i * 12 + 601) * width;
    const py = seededRandom(i * 12 + 602) * height;
    const delay = seededRandom(i * 12 + 603) * 60;
    const op = interpolate(frame, [delay, delay + 60], [0, 0.08], { extrapolateRight: "clamp" });
    const driftX = Math.sin(frame * 0.005 + i) * 50;
    const driftY = Math.cos(frame * 0.004 + i) * 30;

    return (
      <div
        key={`bokeh-${i}`}
        style={{
          position: "absolute",
          left: px + driftX,
          top: py + driftY,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${COLORS.cyanGlow} 0%, transparent 70%)`,
          opacity: op,
          pointerEvents: "none",
        }}
      />
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.void,
        overflow: "hidden",
      }}
    >
      {/* Background particles */}
      {bgParticles}
      {bokehParticles}

      {/* Background glow behind globe */}
      <div
        style={{
          position: "absolute",
          left: cx - 600,
          top: cy - 600,
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${COLORS.neonBlueGlow} 0%, ${COLORS.neonBlueGlow}44 40%, transparent 70%)`,
          opacity: globeOpacity * 0.3,
        }}
      />

      {/* Globe container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: globeOpacity,
          transform: `scale(${globeScale})`,
          transformOrigin: "center center",
        }}
      >
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          {/* SVG Filters - Replaced with CSS drop-shadow for stability */}


          {/* Globe outline */}
          <circle
            cx={cx}
            cy={cy}
            r={globeRadius}
            fill="none"
            stroke={COLORS.neonBlue}
            strokeWidth={2}
            opacity={0.3}
          />

          {/* Grid lines */}
          {latLines}
          {lonLines}

          {/* Data streams */}
          {dataStreams}

          {/* City dots */}
          {cityDots}
        </svg>
      </div>

      {/* Text: IS HERE */}
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
            opacity: textOpacity,
            transform: `translateX(${textX}px)`,
          }}
        >
          <h2
            style={{
              fontSize: 200,
              fontWeight: 200,
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
              color: COLORS.chromeBright,
              letterSpacing: "0.35em",
              margin: 0,
              textShadow: `0 0 20px ${COLORS.neonBlueGlow}`, 
            }}
          >
            IS HERE
          </h2>
        </div>
      </div>
    </div>
  );
};
