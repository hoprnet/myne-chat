import type { FunctionComponent } from "react";
import { Box } from "grommet";
import Logo from "./logo";

const Statistic: FunctionComponent = () => {
  return (
    <Box direction="row" height={{ min: "100%" }}>
      <Box></Box>
      <Box></Box>
      <Logo />
    </Box>
  );
};

export default Statistic;
