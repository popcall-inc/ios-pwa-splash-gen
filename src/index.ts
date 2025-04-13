import {
  Clerc,
  defineCommand,
  type FlagOptions,
  friendlyErrorPlugin,
  helpPlugin,
  versionPlugin,
} from "clerc";
import { generatorModes } from "./modes/registry.ts";
import fs from "node:fs/promises";
import { buildSizes } from "./size-loader.ts";

const commands = generatorModes.map((mode) =>
  defineCommand(
    {
      name: mode.name,
      description: mode.description,
      flags: {
        cutoff: {
          type: Number,
          description: "Oldest year of devices to be supported",
          default: 2017,
        },

        output: {
          type: String,
          description: "Output directory for the generated files",
          default: "./output",
          alias: "o",
        },

        clearOutputDirectory: {
          type: Boolean,
          description: "Clear the output directory before generating",
          default: false,
        },

        // TODO: only set if the mode supports it
        iconSizePercentage: {
          type: Number,
          description:
            "Size percentage of the icon in relation to the shortest side in the generated image (0-100)",
          default: 25,
        },

        ...Object.entries(mode.inputs)
          .map(([name, defaultValue]) => ({
            name,
            type: String,
            default: defaultValue,
            description: `Input path for ${name}`,
          }))
          .reduce<Dict<FlagOptions>>((acc, { name, ...curr }) => {
            acc[name] = curr;
            return acc;
          }, {}),
      },
    },
    async (context) => {
      const {
        output,
        cutoff,
        clearOutputDirectory,
        iconSizePercentage,
        ...rest
      } = context.flags;

      if (iconSizePercentage < 0 || iconSizePercentage > 100) {
        throw new Error(
          `Icon size percentage must be between 0 and 100, got ${iconSizePercentage}`,
        );
      }

      if (clearOutputDirectory) {
        // Delete the output directory if it exists
        await fs.rm(output, { recursive: true }).catch(() => null);
      }

      // Create the output directory
      await fs.mkdir(output, { recursive: true });

      // Load the sizes
      const sizes = buildSizes(cutoff);

      // Grab just the physical sizes (what the images will be) & dedupe
      // noinspection JSSuspiciousNameCombination
      const physicalSizes = sizes
        .map(({ physical }) => ({
          width: physical.width,
          height: physical.height,
        }))
        .filter(
          (size, index, self) =>
            index ===
            self.findIndex(
              (s) => s.width === size.width && s.height === size.height,
            ),
        )
        .map((size) => [
          {
            width: size.width,
            height: size.height,
          },
          {
            // Rotate for landscape devices
            width: size.height,
            height: size.width,
          },
        ])
        .flat();

      console.log(
        `Generating splash images for ${mode.name} (${physicalSizes.length} output images)`,
      );

      await Promise.all(
        physicalSizes.map(async (size) => {
          await mode.generate({
            inputs: rest,
            outputDir: output,
            size,
            iconSizePercentage,
          });
          console.log(
            `Generated splash image for ${size.width}x${size.height} in ${output}`,
          );
        }),
      );

      console.log(
        `Successfully generated splash images for ${mode.name} (${physicalSizes.length} output images)`,
      );
    },
  ),
);

Clerc.create(
  "ios-pwa-splash-gen",
  "Creates splash images and their metadata",
  "1.0.0",
)
  .use(helpPlugin())
  .use(versionPlugin())
  .use(friendlyErrorPlugin())
  .command(commands)
  .parse();
