import type React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { promoFont } from "./promoFont";

// The promo's one authored moment: "근육은 UP" rises, "체지방은 DOWN" drops.
// Direction drives the arrow and the entrance; copy and colour stay editable.
const BigWordInner = ({
  children,
  label,
  direction,
  accent,
  style,
}: {
  readonly children: React.ReactNode;
  readonly label: string;
  readonly direction: "up" | "down";
  readonly accent: string;
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
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 230,
        background:
          "linear-gradient(180deg, rgba(10,8,16,0.62) 0%, rgba(10,8,16,0.35) 34%, rgba(10,8,16,0) 52%)",
        fontFamily: promoFont,
        fontWeight: 700,
        color: "#FFFFFF",
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 76,
          letterSpacing: "-0.02em",
          textShadow: "0 4px 18px rgba(0,0,0,0.45)",
          opacity: interpolate(frame, [0, 0.15 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          marginTop: 4,
          overflow: "hidden",
          padding: "0 12px 16px",
          color: accent,
          // Arrow and word travel together in the direction they name.
          translate:
            direction === "up"
              ? interpolate(frame, [0, 0.4 * fps], ["0px 150px", "0px 0px"], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })
              : interpolate(frame, [0, 0.4 * fps], ["0px -150px", "0px 0px"], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
          opacity: interpolate(frame, [0, 0.12 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width={150} height={190} viewBox="0 0 150 190" style={{ flexShrink: 0 }}>
          <path
            d={direction === "up" ? "M75 180 V22 M18 78 L75 20 L132 78" : "M75 10 V168 M18 112 L75 170 L132 112"}
            fill="none"
            stroke="currentColor"
            strokeWidth={26}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            fontSize: 250,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            textShadow: "0 8px 30px rgba(0,0,0,0.4)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const BigWord = Interactive.create({
  Component: BigWordInner,
  layout: "none",
  schema: {
    ...Interactive.textSchema,
    ...Interactive.childrenSchema,
    label: { type: "string", default: "", description: "Small line above" },
    accent: { type: "color", default: "#FFFFFF", description: "Word and arrow colour" },
  },
});
