import { Video } from "@remotion/media";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { Caption } from "./Caption";
import { EndCard } from "./EndCard";

// Soft top scrim so captions stay legible on bright skies and ceilings.
const TopScrim = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(20,12,4,0.42) 0%, rgba(20,12,4,0) 38%)",
    }}
  />
);

export const TravelReel = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#1C1008" }}>
      <TransitionSeries name="Shots">
        <TransitionSeries.Sequence name="Airport" durationInFrames={5 * fps}>
          <Video name="Airport footage" src={staticFile("01-airport.mp4")} />
          <TopScrim />
          <Caption name="Airport caption" from={0.3 * fps} durationInFrames={4.2 * fps}>
            드디어, 출발.
          </Caption>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })}
        />

        <TransitionSeries.Sequence name="Rock arch" durationInFrames={7 * fps}>
          <Video name="Rock arch footage" src={staticFile("02-rock.mp4")} />
          <TopScrim />
          <Caption name="Rock arch caption" from={0.6 * fps} durationInFrames={5.8 * fps}>
            자연이 만든 액자 속, 우리
          </Caption>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })}
        />

        <TransitionSeries.Sequence name="Lantern" durationInFrames={8 * fps}>
          <Video
            name="Lantern footage"
            src={staticFile("03-lantern.mp4")}
            trimBefore={3 * fps}
          />
          <TopScrim />
          <Caption name="Lantern caption" from={0.6 * fps} durationInFrames={4.6 * fps}>
            소원 하나씩, 꾹꾹 눌러 적고
          </Caption>
          <EndCard name="End card" from={5.6 * fps} durationInFrames={2.4 * fps}>
            또 가자.
          </EndCard>
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
