import type { FunctionComponent } from "react";
import { useTheme } from "../theme";
import { Box, BoxProps } from "grommet";

const StyledBox: FunctionComponent<BoxProps & { noShadow?: boolean }> = (
  props
) => {
  const theme = useTheme();

  return (
    <Box
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
    </Box>
  );
};

export default StyledBox;
