export type Mode =
  | "icon-center-color-background"
  | "image-center-crop"
  | "icon-center-image-background";

export interface GeneratorMode<Inputs extends Record<string, string>> {
  name: Mode;
  description: string;
  inputs: Inputs;
  generate: (context: {
    inputs: Inputs;
    outputDir: string;
    size: { width: number; height: number };
    iconSizePercentage: number;
  }) => Promise<void>;
}

export function createGenerator<Inputs extends Record<string, string>>(
  options: GeneratorMode<Inputs>,
): GeneratorMode<Record<string, string>> {
  return options as unknown as GeneratorMode<Record<string, string>>;
}
