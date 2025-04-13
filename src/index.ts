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

const commands = generatorModes.map((mode) =>
  defineCommand(
    {
      name: mode.name,
      description: mode.description,
      flags: {
        output: {
          type: String,
          description: "Output directory for the generated files",
          default: "./output",
          alias: "o",
        },

        ...Object.entries(mode.inputs)
          .map(([name, defaultValue]) => ({
            name,
            type: String,
            defaultValue,
            description: `Input path for ${name}`,
          }))
          .reduce<Dict<FlagOptions>>((acc, { name, ...curr }) => {
            acc[name] = curr;
            return acc;
          }, {}),
      },
    },
    async (context) => {
      const { output, ...rest } = context.flags;
      await fs.mkdir(output, { recursive: true });
      await mode.generate(rest, output);
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
