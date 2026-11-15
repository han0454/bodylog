import type React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./fonts";

// Closing line over a warm scrim, settling in from a soft blur.
const EndCardInner = ({
  children,
  style,
}: {
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(28, 16, 8, 0.55)",
        opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        ...style,
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 168,
          letterSpacing: "-0.03em",
          color: "#FFFBF4",
          textShadow: "0 6px 32px rgba(20, 12, 4, 0.5)",
          filter: `blur(${interpolate(frame, [0, 0.7 * fps], [18, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}px)`,
          scale: interpolate(frame, [0, 0.9 * fps], [1.08, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const EndCard = Interactive.create({
  Component: EndCardInner,
  layout: "none",
  schema: {
    ...Interactive.childrenSchema,
  },
});
