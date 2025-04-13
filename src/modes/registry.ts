import type { GeneratorMode } from "./index.ts";
import { iconCenterColorBackground } from "./icon-center-color-background.ts";
import { imageCenterCrop } from "./image-center-crop.ts";
import { iconCenterImageBackground } from "./icon-center-image-background.ts";

export const generatorModes: GeneratorMode<any>[] = [
  iconCenterColorBackground,
  imageCenterCrop,
  iconCenterImageBackground,
];
