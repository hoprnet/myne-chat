import type { FunctionComponent } from "react";
import { useTheme } from "../theme";
import { Box as GrommetBox, BoxProps } from "grommet";

const Box: FunctionComponent<BoxProps & { useShadow?: boolean }> = (props) => {
  const theme = useTheme();

  return (
    <GrommetBox
      round={theme.global.raw.radii.default}
      pad={{
        vertical: theme.global.raw.space.small,
        horizontal: theme.global.raw.space.small,
      }}
      style={{
        boxShadow: props.useShadow
          ? theme.global.raw.shadows.default
          : undefined,
      }}
      {...props}
    >
      {props.children}
    </GrommetBox>
  );
};

export default Box;
