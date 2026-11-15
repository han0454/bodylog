import type React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { promoFont } from "./promoFont";

// Caption on a lime slab that wipes open left-to-right, then the text
// lands. Sits below the burned-in "EMS" title and above Reels' bottom UI.
const PromoCaptionInner = ({
  children,
  style,
}: {
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 160,
        top: 1400,
        display: "flex",
        justifyContent: "flex-start",
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor: "#D8FF3C",
          color: "#14110F",
          fontFamily: promoFont,
          fontWeight: 700,
          fontSize: 70,
          lineHeight: 1.22,
          letterSpacing: "-0.03em",
          wordBreak: "keep-all",
          padding: "18px 30px 22px",
          borderRadius: 14,
          boxShadow: "0 10px 30px rgba(10, 8, 20, 0.35)",
          clipPath: `inset(0 ${interpolate(
            frame,
            [0, 0.35 * fps, durationInFrames - 0.25 * fps, durationInFrames],
            [100, 0, 0, 100],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          )}% 0 0 round 14px)`,
        }}
      >
        <div
          style={{
            translate: interpolate(frame, [0.12 * fps, 0.5 * fps], ["0px 28px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            opacity: interpolate(frame, [0.12 * fps, 0.4 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const PromoCaption = Interactive.create({
  Component: PromoCaptionInner,
  layout: "none",
  schema: {
    ...Interactive.textSchema,
    ...Interactive.childrenSchema,
  },
});
