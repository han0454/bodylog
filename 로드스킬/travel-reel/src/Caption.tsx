import type React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./fonts";

// One line of journal-style copy. The line rises out of a mask on entry
// and sinks back on exit: the reel's single authored motion moment.
const CaptionInner = ({
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
        top: 260,
        width: 860,
        overflow: "hidden",
        paddingBottom: 24,
        fontFamily,
        fontWeight: 700,
        fontSize: 96,
        lineHeight: 1.15,
        letterSpacing: "-0.03em",
        color: "#FFFBF4",
        textShadow: "0 4px 24px rgba(20, 12, 4, 0.45)",
        textWrap: "balance",
        wordBreak: "keep-all",
        ...style,
      }}
    >
      <div
        style={{
          translate: interpolate(
            frame,
            [0, 0.6 * fps, durationInFrames - 0.4 * fps, durationInFrames],
            ["0px 130%", "0px 0%", "0px 0%", "0px 130%"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Caption = Interactive.create({
  Component: CaptionInner,
  layout: "none",
  schema: {
    ...Interactive.textSchema,
    ...Interactive.childrenSchema,
  },
});
