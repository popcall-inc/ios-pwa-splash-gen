import { createGenerator } from "./index.ts";

export const imageCenterCrop = createGenerator({
  name: "image-center-crop",
  description: "Crop a static image to cover the area",
  inputs: {
    image: "image.png",
  },
  async generate({ image }, outputDir) {},
});
