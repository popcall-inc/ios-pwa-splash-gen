import { createGenerator } from "./index.ts";
import sharp from "sharp";

export const imageCenterCrop = createGenerator({
  name: "image-center-crop",
  description: "Crop a static image to cover the area",
  inputs: {
    background: "background.png",
  },
  async generate({ inputs: { background }, outputDir, size }) {
    await sharp(background)
      .resize({
        width: size.width,
        height: size.height,
        fit: "cover",
      })
      .png()
      .toFile(`${outputDir}/${size.width}x${size.height}.png`);
  },
});
