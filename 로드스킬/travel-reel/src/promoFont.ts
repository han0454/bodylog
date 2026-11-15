import { loadFont } from "@remotion/fonts";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// IBM Plex Sans KR Bold (SIL OFL), self-hosted. A firm sans that sits
// next to the bold "EMS" title already burned into the footage.
export const promoFont = "IBM Plex Sans KR";

const handle = delayRender("Loading IBM Plex Sans KR");
loadFont({
  family: promoFont,
  url: staticFile("fonts/IBMPlexSansKR-Bold.ttf"),
  weight: "700",
  format: "truetype",
})
  .then(() => continueRender(handle))
  .catch((err) => cancelRender(err));
