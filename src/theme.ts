/**
 * Initialize there to be used throughout the codebase.
 * You should priorize Grommet theme > styled-components > inline styles.
 */
import type { ThemeType } from "grommet";
import { useContext } from "react";
import { ThemeContext } from "grommet";

// create our theme by extending grommet's ThemeType
const makeTheme = <T extends ThemeType>(t: T) => t;

// react hook to access our theme
export const useTheme = () => useContext<Theme>(ThemeContext as any);

// unopinioned theme data
const raw = {
  colors: {
    "dark-1": "black",
    "dark-2": "#282828", // PDF: Window-BG
    "dark-3": "#3d3d3d", // PDF: Sidebar
    "dark-4": "#5c5c5c", // PDF: Mainwindow
    "light-1": "white",
    "light-2": "#c3c3c3", // PDF: Chatbox-user
    brand: "#7af5e7", // PDF: myne-turquoise
    "brand-disabled": "#2b5651", // PDF: inactive button
  },

  // specify font properties
  fonts: {
    default: "GerstnerProgrammFSL",
    heading: "inherit", // TODO: update to PDF's values
    monospace: "inherit", // TODO: update to PDF's values
  },
  fontWeights: {
    default: "400",
    heading: "700",
    bold: "700",
  },
  lineHeights: {
    default: "1.5",
    heading: "1.25",
  },
  fontSizes: {
    default: "14px",
    heading: "21px",
  },

  // specify various properties
  space: {
    small: "9px",
    medium: "18px",
    large: "36px",
  },
  radii: {
    default: "9px",
  },
  shadows: {
    default: "0px 2px 3px #00000091",
  },
};

// transform theme data to Grommet compatible theme
const theme = makeTheme({
  global: {
    raw,
    colors: {
      ...raw.colors,
      "accent-1": raw.colors["light-1"],
      "accent-2": raw.colors.brand,
      "accent-3": raw.colors["brand-disabled"],
      "accent-4": "#E04E0B", // PDF: weblinks
      "background-back": raw.colors["dark-2"],
      "status-disabled": raw.colors["brand-disabled"],
    },
    font: {
      family: raw.fonts.default,
      size: raw.fontSizes.default,
      height: raw.lineHeights.default,
      weight: raw.fontWeights.default,
    },
    spacing: raw.space.medium,
  },

  text: {
    medium: {
      size: raw.fontSizes.heading,
    },
    small: {
      size: raw.fontSizes.default,
    },
  },

  button: {
    minWidth: "96px",
    maxWidth: "384px",
    padding: {
      horizontal: raw.space.medium,
      vertical: raw.space.small,
    },
    border: {
      radius: raw.radii.default,
      width: "0px",
    },
    extend: `box-shadow: ${raw.shadows.default};`,
    default: {
      background: "brand-disabled",
      color: "light-1",
    },
    active: {
      default: {
        background: "accent-2",
        color: "brand-disabled",
      },
    },
  },

  textArea: {
    extend: `border: none;`,
  },
});

export type Theme = typeof theme;
export default theme;

// overwrite DefaultTheme with our theme
// ThemeProvider will now know what our theme looks like
declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
