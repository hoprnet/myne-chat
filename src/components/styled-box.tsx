import type { FunctionComponent } from "react";
import type { Theme } from "../theme";
import { useContext } from "react";
import { ThemeContext, Box as GrommetBox, BoxProps } from "grommet";

const Box: FunctionComponent<BoxProps> = (props) => {
  const theme = useContext<Theme>(ThemeContext as any);

  return (
    <GrommetBox
      round={theme.global.raw.radii.default}
      pad={{
        vertical: theme.global.raw.space.small,
        horizontal: theme.global.raw.space.medium,
      }}
      style={{
        boxShadow: theme.global.raw.shadows.default,
      }}
      {...props}
    >
      {props.children}
    </GrommetBox>
  );
};

export default Box;
