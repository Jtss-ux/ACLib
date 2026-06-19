/**
 * Main Composition: 30-second cinematic YouTube intro for "AI with JTS"
 *
 * Sequences 4 scenes with cross-fade transitions:
 *   Scene 1: The Awakening    (0:00 – 0:05)  frames 0–300
 *   Scene 2: Global Connection (0:05 – 0:12)  frames 300–720
 *   Scene 3: The Human Element (0:12 – 0:20)  frames 720–1200
 *   Scene 4: The Final Reveal  (0:20 – 0:30)  frames 1200–1800
 */
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Audio, staticFile } from "remotion";
import { SceneAwakening } from "./scenes/SceneAwakening";
import { SceneGlobalConnection } from "./scenes/SceneGlobalConnection";
import { SceneHumanElement } from "./scenes/SceneHumanElement";
import { SceneLogoReveal } from "./scenes/SceneLogoReveal";

// Scene timing (in frames at 60fps)
const SCENES = [
  { start: 0, duration: 330, Component: SceneAwakening },       // 5.5s
  { start: 300, duration: 450, Component: SceneGlobalConnection }, // 7.5s
  { start: 720, duration: 510, Component: SceneHumanElement },    // 8.5s
  { start: 1200, duration: 600, Component: SceneLogoReveal },     // 10s
] as const;

// Cross-fade duration in frames
const CROSSFADE = 30; // 0.5 second at 60fps

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Global cinematic camera push
  const globalScale = 1 + frame / 2000;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* Background Layer: Slow Camera Push & Radial Gradient */}
      <AbsoluteFill
        style={{
          transform: `scale(${globalScale})`,
          background: "radial-gradient(circle, #1a1a2e 0%, #000 80%)",
          zIndex: 0,
        }}
      />

      {/* Cinematic Audio Layer */}
      {/* Using a local placeholder file. User can replace this with their own audio.mp3 in public/ folder. */}
      <Audio 
        src={staticFile("audio.mp3")} 
        placeholder="Audio for AI Intro"
      />

      {SCENES.map(({ start, duration, Component }, index) => {
        const localFrame = frame - start;

        // Skip if not in range
        if (localFrame < -CROSSFADE || localFrame > duration) return null;

        // Fade in
        const fadeIn =
          index === 0
            ? 1
            : interpolate(localFrame, [0, CROSSFADE], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

        // Fade out
        const fadeOut =
          index === SCENES.length - 1
            ? 1
            : interpolate(
                localFrame,
                [duration - CROSSFADE, duration],
                [1, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

        const opacity = fadeIn * fadeOut;

        // Cinematic Transition Effects: Scale (Removed Blur for stability)
        const transitionScale = interpolate(
          localFrame,
          [duration - CROSSFADE, duration],
          [1, 1.05],
          { extrapolateLeft: "clamp" }
        );

        return (
          <Sequence key={index} from={start} durationInFrames={duration}>
            <AbsoluteFill style={{ 
              opacity,
              transform: `scale(${transitionScale})`
            }}>
              <Component
                frame={Math.max(0, localFrame)}
                fps={fps}
                width={width}
                height={height}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* GLOBAL CINEMATIC OVERLAYS */}

      {/* 1. Film Grain Layer */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div 
          style={{ 
            position: "absolute",
            inset: -100,
            opacity: 0.04,
            backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')`,
            transform: `translate(${Math.random() * 10}px, ${Math.random() * 10}px)`,
          }}
        />
      </AbsoluteFill>

      {/* 2. Focal Vignette */}
      <AbsoluteFill 
        style={{ 
          pointerEvents: "none",
          background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }} 
      />

      {/* 3. Lens Leak Transition (Active during crossfades) */}
      {SCENES.map(({ start, duration }, index) => {
        if (index === SCENES.length - 1) return null;
        const transitionFrame = frame - (start + duration - CROSSFADE);
        if (transitionFrame < 0 || transitionFrame > CROSSFADE * 2) return null;
        
        const leakOpacity = interpolate(transitionFrame, [0, CROSSFADE, CROSSFADE * 2], [0, 0.2, 0]);
        const leakX = interpolate(transitionFrame, [0, CROSSFADE * 2], [-width, width]);

        return (
          <AbsoluteFill 
            key={`leak-${index}`}
            style={{ 
              pointerEvents: "none",
              background: `linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.4), rgba(59, 130, 246, 0.4), transparent)`,
              opacity: leakOpacity,
              transform: `translateX(${leakX}px)`,
              filter: "blur(40px)",
              zIndex: 100
            }} 
          />
        );
      })}
    </AbsoluteFill>
  );
};
