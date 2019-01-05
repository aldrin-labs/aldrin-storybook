import addonBackgrounds from "@storybook/addon-backgrounds";

import { customThemes } from '../../.storybook/customTheme'

export const backgrounds = addonBackgrounds([
  { name: "Default light", value: customThemes.light.palette.background.default, default: true },
  { name: "Paper light", value: customThemes.light.palette.background.paper },
  { name: "Default dark", value: customThemes.dark.palette.background.default },
  { name: "Paper light", value: customThemes.dark.palette.background.paper }
])