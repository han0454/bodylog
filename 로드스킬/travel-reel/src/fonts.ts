import { loadFont } from "@remotion/fonts";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// Hahmlet (SIL OFL), self-hosted variable font covering weights 100–900.
export const fontFamily = "Hahmlet";

const handle = delayRender("Loading Hahmlet");
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Hahmlet.ttf"),
  weight: "100 900",
  format: "truetype",
})
  .then(() => continueRender(handle))
  .catch((err) => cancelRender(err));
