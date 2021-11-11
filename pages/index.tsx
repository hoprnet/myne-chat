import type { NextPage } from "next";
import { Box } from "grommet";
import Statistics from "../src/components/statistics";
import Chat from "../src/components/chat";

const HomePage: NextPage = () => {
  return (
    <Box fill direction="row" justify="between" pad="small">
      <Box width="250px" pad={{ right: "small" }}>
        <Statistics />
      </Box>
      <Box width="100%" height="100%">
        <Chat />
      </Box>
    </Box>
  );
};

export default HomePage;
