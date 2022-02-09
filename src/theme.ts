/**
 * Initialize theme to be used throughout the codebase.
 * You should priorize Grommet theme > styled-components > inline styles.
 */
import type { ThemeType } from "grommet";
import { useContext } from "react";
import { css } from "styled-components";
import { ThemeContext } from "grommet";

// various styling preferences, taken from PDF
const custom = {
  colors: {
    // custom named colors
    "myne-turquoise": "#7af5e7",
    "myne-darkgreen": "#2b5651",
    "myne-darkorange": "#E04E0B",
    fatalError: "#f57a88",
    // specific to components
    windowBG: "#282828",
    sidebar: "#3d3d3d",
    mainWindow: "#5c5c5c",
    chatbox: "#c3c3c3",
  },
  radius: "9px",
  shadow: "0px 2px 3px #00000091",
};

// create our theme by extending grommet's ThemeType
const makeTheme = <T extends ThemeType>(t: T) => t;

// transform theme data to Grommet compatible theme
const theme = makeTheme({
  custom,

  global: {
    colors: {
      brand: custom.colors["myne-turquoise"],
      "dark-1": "black",
      "dark-2": custom.colors.windowBG,
      "dark-3": custom.colors.sidebar,
      "dark-4": custom.colors.mainWindow,
      "light-1": custom.colors.chatbox,
      "light-2": custom.colors.chatbox,
      "accent-1": "white",
      "accent-2": custom.colors["myne-turquoise"],
      "accent-3": custom.colors["myne-darkgreen"],
      "accent-4": custom.colors["myne-darkorange"],
      "background-back": custom.colors.windowBG,
      "status-disabled": custom.colors["myne-darkgreen"],
      "status-success": custom.colors["myne-turquoise"],
      "status-error": custom.colors["myne-darkgreen"],
      "fatal-error": custom.colors.fatalError
    },

    // this setting affects various areas, see https://v2.grommet.io/box at `global.edgeSize`
    // we have an issue here since it affects both padding and border radius (totally weird behaviour)
    // in this webapp, we use this setting for everything but border radius, border radius is overwritten
    // by extending the box component
    edgeSize: {
      small: "9px",
      medium: "18px",
      large: "36px",
    },

    font: {
      family: "GerstnerProgrammFSL",
      size: "medium",
    },

    focus: {
      border: {
        color: "none",
      },
    },
  },

  box: {
    extend: (props) => {
      return css({
        // see `theme.global.edgeSize`, here we overwrite `border-radius`
        "border-radius": props.round ? custom.radius : undefined,
        "box-shadow": props.shadow ? custom.shadow : undefined,
      });
    },
  },

  text: {
    small: {
      size: "14px",
    },
    medium: {
      size: "21px",
    },
  },

  button: {
    minWidth: "96px",
    maxWidth: "384px",
    padding: {
      horizontal: "medium",
      vertical: "small",
    },
    border: {
      radius: custom.radius,
    },
    extend: (props) => {
      return css({
        "box-shadow": props.shadow ? custom.shadow : undefined,
      });
    },
    default: {
      background: "status-disabled",
      color: "light-1",
    },
    hover: {
      default: {
        background: "accent-2",
        color: "status-disabled",
      },
    },
  },

  textArea: {
    extend: () => {
      return css({
        border: "none",
        caretColor: custom.colors["myne-turquoise"],
      });
    },
  },
});

// react hook to access our theme
export type Theme = typeof theme;

/**
 * React hook which returns our theme.
 * @returns the theme
 */
export const useTheme = () => useContext<Theme>(ThemeContext as any);

export default theme;

declare module "grommet" {
  // overwrite DefaultTheme with our theme
  // ThemeProvider will now know what our theme looks like
  export interface DefaultTheme extends Theme {}

  // insert our custom shadow type
  export interface BoxExtendedProps {
    shadow?: boolean;
  }
  export interface TextAreaExtendedProps {
    shadow?: boolean;
  }
  export interface ButtonExtendedProps {
    shadow?: boolean;
  }
  export interface SidebarExtendedProps {
    shadow?: boolean;
  }
}
