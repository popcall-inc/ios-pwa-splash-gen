import type { Size } from "./size-loader.ts";
import fs from "node:fs/promises";

function makeMetaItem(
  size: Size,
  orientation: "portrait" | "landscape",
  pathPrefix: string,
): string {
  return `<link rel="apple-touch-startup-image" media="(device-width: ${size.logical.width}px) and (device-height: ${size.logical.height}px) and (-webkit-device-pixel-ratio: ${size.scalingFactor}) and (orientation: ${orientation})" href="${pathPrefix}/${size.physical.width}x${size.physical.height}.png">`;
}

export async function generateMeta(
  sizes: Size[],
  outputDir: string,
  imagePathPrefix: string,
): Promise<void> {
  const text = sizes
    .map((size) => [
      makeMetaItem(size, "portrait", imagePathPrefix),
      makeMetaItem(size, "landscape", imagePathPrefix),
    ])
    .flat()
    // Final dedupe
    .filter((item, index, self) => index === self.findIndex((i) => i === item))
    .join("\n");
  const filePath = `${outputDir}/meta.html`;
  await fs.writeFile(filePath, text, { encoding: "utf-8" });
}
