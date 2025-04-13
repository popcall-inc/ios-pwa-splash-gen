import { createGenerator } from "./index.ts";

export const iconCenterColorBackground = createGenerator({
  name: "icon-center-color-background",
  description: "Fix the icon in the center, with a static color background",
  inputs: {
    icon: "icon.png",
  },
  async generate({ icon }, outputDir) {},
});
