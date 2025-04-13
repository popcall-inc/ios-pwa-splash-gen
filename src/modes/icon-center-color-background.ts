import { createGenerator } from "./index.ts";
import sharp from "sharp";

export const iconCenterColorBackground = createGenerator({
  name: "icon-center-color-background",
  description: "Fix the icon in the center, with a static color background",
  inputs: {
    icon: "icon.png",
    color: "#ffffff",
  },
  async generate({
    inputs: { icon, color },
    outputDir,
    size,
    iconSizePercentage,
  }) {
    // Validate the color is a hex color
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      throw new Error(`Invalid color: ${color}`);
    }

    const sharpIcon = await sharp(icon)
      .resize({
        fit: "inside",
        width: Math.floor(
          Math.min(size.width, size.height) * (iconSizePercentage / 100),
        ),
      })
      .toBuffer();

    await sharp({
      create: {
        width: size.width,
        height: size.height,
        channels: 4,
        background: color,
      },
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
