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
import { PromoCaption } from "./PromoCaption";
import { promoFont } from "./promoFont";

// The footage's own music runs continuously underneath; the cut clips
// are muted so the track never jumps at a cut.
const SourceMusic = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <Audio
      name="Original music"
      src={staticFile("ems.mp4")}
      volume={interpolate(
        frame,
        [0, durationInFrames - 1.5 * fps, durationInFrames],
        [0.9, 0.9, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )}
    />
  );
};

// Slow push-in so each static shot keeps moving.
const Shot = ({ trimBefore, origin }: { readonly trimBefore: number; readonly origin: string }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        transformOrigin: origin,
        scale: interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <Video src={staticFile("ems.mp4")} trimBefore={trimBefore} muted />
    </AbsoluteFill>
  );
};

const EndCardText = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "rgba(16, 12, 28, 0.62)",
        justifyContent: "center",
        alignItems: "center",
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
          fontSize: 120,
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
          color: "#FFFFFF",
          textAlign: "center",
          wordBreak: "keep-all",
          translate: interpolate(frame, [0, 0.6 * fps], ["0px 40px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        지금,
        <br />
        <span style={{ color: "#D8FF3C" }}>체험해 보세요.</span>
      </div>
    </AbsoluteFill>
  );
};

export const EmsPromo = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#100C1C" }}>
      <Track name="Shots">
        <Sequence name="Shot 1: intro" durationInFrames={4.5 * fps}>
          <Shot trimBefore={0} origin="50% 40%" />
          <PromoCaption name="Caption 1" from={0.6 * fps} durationInFrames={3.8 * fps}>
            운동할 시간, 없으시죠?
          </PromoCaption>
        </Sequence>
        <Sequence name="Shot 2: bed" from={4.5 * fps} durationInFrames={4.5 * fps}>
          <Shot trimBefore={10 * fps} origin="75% 60%" />
          <PromoCaption name="Caption 2" from={0.2 * fps} durationInFrames={4.2 * fps}>
            누워만 있어도 전신 근육을 깨우는 EMS
          </PromoCaption>
        </Sequence>
        <Sequence name="Shot 3: adjust" from={9 * fps} durationInFrames={4.5 * fps}>
          <Shot trimBefore={34 * fps} origin="40% 55%" />
          <PromoCaption name="Caption 3" from={0.2 * fps} durationInFrames={4.2 * fps}>
            내 몸에 맞춰 강도를 조절해요
          </PromoCaption>
        </Sequence>
        <Sequence name="Shot 4: routine" from={13.5 * fps} durationInFrames={3.5 * fps}>
          <Shot trimBefore={47 * fps} origin="50% 50%" />
          <PromoCaption name="Caption 4" from={0.2 * fps} durationInFrames={3.2 * fps}>
            바쁜 하루, 나를 위한 시간
          </PromoCaption>
        </Sequence>
        <Sequence name="End card" from={17 * fps} durationInFrames={3 * fps}>
          <Shot trimBefore={50.5 * fps} origin="50% 50%" />
          <EndCardText />
        </Sequence>
      </Track>
      <SourceMusic />
      {/* Voiceover slot: when the recording arrives, add
          <Audio name="Voiceover" src={staticFile("voice.m4a")} />
          here and lower "Original music" to ~0.25 so the voice sits on top. */}
    </AbsoluteFill>
  );
};
