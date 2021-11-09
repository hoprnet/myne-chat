import type { FunctionComponent } from "react";
import { Box, List, Text } from "grommet";
import { conversations, Conversation } from "../mocks";
import StyledBox from "./styled-box";
import Logo from "./logo";

const Statistic: FunctionComponent = () => {
  return (
    <StyledBox
      direction="column"
      justify="between"
      height={{ min: "100%" }}
      width="250px"
      background="dark-3"
    >
      <Box>+</Box>
      <Box>
        {/* <List
          primaryKey="with"
          data={conversations}
          // border={false}
          // pad={{
          //   horizontal: "none",
          //   bottom: theme.global.raw.space.large,
          // }}
        >
          {(conv: Conversation) => {
            return (
              <Box>
                <Text>{conv.with}</Text>
              </Box>
            );
          }}
        </List> */}
      </Box>
      <Logo />
    </StyledBox>
  );
};

export default Statistic;
