/**
 * Initialize there to be used throughout the codebase.
 * You should priorize Grommet theme > styled-components > inline styles.
 */
import type { ThemeType } from "grommet";

// unopinioned theme data
const raw = {
  colors: {
    darkestBackground: "#282828", // Window-BG
    darkBackground: "#3d3d3d", // Sidebar
    background: "#5c5c5c", // Mainwindow
    lightBackground: "#c3c3c3", // Chatbox-user
    highlight: "#7af5e7", // myne-turquoise
    muted: "#2b5651",
    gray: "#dddddf",
  },

  // specify font properties
  fonts: {
    default: "system-ui, sans-serif",
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

const makeTheme = <T extends ThemeType>(t: T) => t;

// transform theme data to Grommet compatible theme
// TODO: improve colors
const theme = makeTheme({
  global: {
    raw,
    colors: {
      "accent-1": "white",
      "accent-2": raw.colors.highlight,
      "background-back": raw.colors.darkestBackground,
      "dark-1": "black",
      "dark-2": raw.colors.background,
      "dark-3": raw.colors.darkBackground,
      "dark-4": raw.colors.darkestBackground,
      "light-1": "white",
      "light-2": raw.colors.lightBackground,
      "status-unknown": raw.colors.muted,
      "status-disabled": raw.colors.muted,
      "status-inactive": raw.colors.muted,
    },
    font: {
      face: raw.fonts.default,
      size: raw.fontSizes.default,
      height: raw.lineHeights.default,
      weight: raw.fontWeights.default,
    },
    spacing: raw.space.medium,
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
      background: "status-inactive",
      color: "light-1",
    },
    active: {
      default: {
        background: "accent-2",
        color: "status-inactive",
      },
    },
  },

  textArea: {
    extend: `border: none;`,
  },
});

export default theme;

export type Theme = typeof theme;

// overwrite DefaultTheme with our theme
// ThemeProvider will now know what our theme looks like
declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
