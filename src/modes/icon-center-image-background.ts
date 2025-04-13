import { createGenerator } from "./index.ts";

export const iconCenterImageBackground = createGenerator({
  name: "icon-center-image-background",
  description:
    "Fix the icon in the center, and cover the background in an image.",
  inputs: {
    icon: "icon.png",
    background: "background.png",
  },
  async generate({ icon, background }, outputDir) {},
});
