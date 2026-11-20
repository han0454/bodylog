import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  Track,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BigWord } from "./BigWord";
import { PromoCaption } from "./PromoCaption";
import { promoFont } from "./promoFont";

// Every cut and caption below is timed to the recorded voice (voice2.m4a,
// trimmed by 0.6 s so the first word lands at ~0.15 s).

// The clip's own music, continuous under the voice. The source is 17.4 s,
// so it bows out just as the store name is spoken.
const SourceMusic = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Audio
      name="Original music"
      src={staticFile("ems2.mp4")}
      volume={interpolate(frame, [0, 16.2 * fps, 17.2 * fps], [0.2, 0.2, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })}
    />
  );
};

// Slow push-in so handheld shots keep moving; playbackRate stretches the
// short close-up and the closing shot.
const Shot = ({
  trimBefore,
  origin,
  playbackRate = 1,
  zoomTo = 1.08,
}: {
  readonly trimBefore: number;
  readonly origin: string;
  readonly playbackRate?: number;
  readonly zoomTo?: number;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        transformOrigin: origin,
        scale: interpolate(frame, [0, durationInFrames], [1, zoomTo], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <Video
        src={staticFile("ems2.mp4")}
        trimBefore={trimBefore}
        playbackRate={playbackRate}
        muted
      />
    </AbsoluteFill>
  );
};

const ClosingCard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(14, 10, 24, 0.66)",
        opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          fontFamily: promoFont,
          fontWeight: 700,
          fontSize: 96,
          letterSpacing: "-0.02em",
          color: "#FFFFFF",
          opacity: interpolate(frame, [0.9 * fps, 1.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0.9 * fps, 1.5 * fps], ["0px 36px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        피다다이어트에서
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: promoFont,
          fontWeight: 700,
          fontSize: 140,
          letterSpacing: "-0.03em",
          color: "#D8FF3C",
          opacity: interpolate(frame, [1.6 * fps, 1.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [1.6 * fps, 2.2 * fps], ["0px 44px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        시작하세요.
      </div>
      <div
        style={{
          marginTop: 56,
          padding: "14px 34px",
          border: "2px solid rgba(255, 255, 255, 0.55)",
          borderRadius: 999,
          fontFamily: promoFont,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: "0.02em",
          color: "#FFFFFF",
          opacity: interpolate(frame, [2.6 * fps, 3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        EMS 20분
      </div>
    </AbsoluteFill>
  );
};

export const EmsPromo2 = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0E0A18" }}>
      <Track name="Shots">
        <Sequence name="Suit up" durationInFrames={4.4 * fps}>
          <Shot trimBefore={0} origin="60% 45%" />
          <PromoCaption name="Line 1a" from={0.1 * fps} durationInFrames={1.7 * fps}>
            수트 하나 입었을 뿐인데,
          </PromoCaption>
          <PromoCaption name="Line 1b" from={1.85 * fps} durationInFrames={2.45 * fps}>
            운동 준비 끝!
          </PromoCaption>
        </Sequence>
        <Sequence name="Sitting" from={4.4 * fps} durationInFrames={5 * fps}>
          <Shot trimBefore={7.5 * fps} origin="70% 55%" />
          <PromoCaption name="Line 2a" from={0.15 * fps} durationInFrames={1.55 * fps}>
            힘든 동작 없이도,
          </PromoCaption>
          <PromoCaption name="Line 2b" from={1.75 * fps} durationInFrames={3.1 * fps}>
            근육은 쉬지 않아요.
          </PromoCaption>
        </Sequence>
        <Sequence name="Lying down" from={9.4 * fps} durationInFrames={3.4 * fps}>
          <Shot trimBefore={12.8 * fps} origin="40% 60%" />
          <PromoCaption name="Line 3" from={0.2 * fps} durationInFrames={3.1 * fps}>
            편하게 누워서, 딱 20분.
          </PromoCaption>
        </Sequence>
        <Sequence name="Strap detail" from={12.8 * fps} durationInFrames={0.8 * fps}>
          <Shot trimBefore={4.3 * fps} origin="75% 40%" zoomTo={1.18} />
        </Sequence>
        <Sequence name="Suit close-up" from={13.6 * fps} durationInFrames={2 * fps}>
          <Shot trimBefore={16.28 * fps} origin="50% 40%" playbackRate={0.4} zoomTo={1.12} />
        </Sequence>
        <Sequence name="Closing" from={15.6 * fps} durationInFrames={4.4 * fps}>
          <Shot trimBefore={13.6 * fps} origin="50% 55%" playbackRate={0.6} />
          <ClosingCard />
        </Sequence>
      </Track>
      <Track name="Impact words">
        <BigWord
          name="Muscle up"
          from={12.85 * fps}
          durationInFrames={0.75 * fps}
          label="근육은"
          direction="up"
          accent="#D8FF3C"
        >
          UP
        </BigWord>
        <BigWord
          name="Body fat down"
          from={13.62 * fps}
          durationInFrames={1.98 * fps}
          label="체지방은"
          direction="down"
          accent="#FFFFFF"
        >
          DOWN
        </BigWord>
      </Track>
      <SourceMusic />
      <Audio name="Voiceover" src={staticFile("voice2.m4a")} trimBefore={0.6 * fps} />
    </AbsoluteFill>
  );
};
