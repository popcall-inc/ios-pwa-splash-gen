import { createGenerator } from "./index.ts";
import sharp from "sharp";

export const iconCenterImageBackground = createGenerator({
  name: "icon-center-image-background",
  description:
    "Fix the icon in the center, and cover the background in an image.",
  inputs: {
    icon: "icon.png",
    background: "background.png",
  },
  async generate({
    inputs: { icon, background },
    outputDir,
    size,
    iconSizePercentage,
  }) {
    const sharpIcon = await sharp(icon)
      .resize({
        fit: "inside",
        width: Math.floor(
          Math.min(size.width, size.height) * (iconSizePercentage / 100),
        ),
      })
      .toBuffer();

    await sharp(background)
      .resize({
        width: size.width,
        height: size.height,
        fit: "cover",
      })
      .composite([
        {
          input: sharpIcon,
          gravity: "center",
        },
      ])
      .png()
      .toFile(`${outputDir}/${size.width}x${size.height}.png`);
  },
});
