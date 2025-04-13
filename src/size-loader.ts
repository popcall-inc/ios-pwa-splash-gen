import sizes from "./sizes.json" assert { type: "json" };

export interface Size {
  logical: {
    width: number;
    height: number;
  };
  physical: {
    width: number;
    height: number;
  };
  scalingFactor: number;
}

export function buildSizes(cutoffYear: number): Size[] {
  return sizes
    .filter((device) => {
      if (device.model.toLowerCase().includes("watch")) {
        return false;
      }

      const year = parseInt(device.releaseDate.substring(0, 4));
      return year >= cutoffYear;
    })
    .map((size) => ({
      logical: {
        width: size.logicalWidth,
        height: size.logicalHeight,
      },
      physical: {
        width: size.physicalWidth,
        height: size.physicalHeight,
      },
      scalingFactor: size.scaleFactor,
    }));
}
