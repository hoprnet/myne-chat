import type { NextPage } from "next";
import { Box } from "grommet";
import Statistics from "../src/components/statistics";
import Chat from "../src/components/chat";
import { useTheme } from "../src/theme";

const HomePage: NextPage = () => {
  const theme = useTheme();

  return (
    <Box
      fill
      direction="row"
      justify="between"
      pad={theme.global.raw.space.small}
    >
      <Box width="250px" pad={{ right: theme.global.raw.space.small }}>
        <Statistics />
      </Box>
      <Box width="100%" height="100%">
        <Chat />
      </Box>
    </Box>
  );
};

export default HomePage;
