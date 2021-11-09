import type { FunctionComponent } from "react";
import { useTheme } from "../theme";
import { Box as GrommetBox, BoxProps } from "grommet";

const Box: FunctionComponent<BoxProps & { noShadow?: boolean }> = (props) => {
  const theme = useTheme();

  return (
    <GrommetBox
      round={theme.global.raw.radii.default}
      pad={{
        vertical: theme.global.raw.space.small,
        horizontal: theme.global.raw.space.small,
      }}
      style={{
        boxShadow: props.noShadow
          ? undefined
          : theme.global.raw.shadows.default,
      }}
      {...props}
    >
      {props.children}
    </GrommetBox>
  );
};

export default Box;
