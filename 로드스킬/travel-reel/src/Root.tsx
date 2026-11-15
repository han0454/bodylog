import { Composition } from "remotion";
import { EmsPromo } from "./EmsPromo";
import { TravelReel } from "./TravelReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TravelReel"
        component={TravelReel}
        durationInFrames={564}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EmsPromo"
        component={EmsPromo}
        durationInFrames={585}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
