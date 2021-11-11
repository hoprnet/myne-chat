import type { FunctionComponent } from "react";
import { Box } from "grommet";
import { messages } from "../mocks";
import StyledBox from "./styled-box";
import ChatView from "./chat-view";
import ChatInput from "./chat-input";

const Chat: FunctionComponent = () => {
  return (
    <StyledBox
      justify="between"
      background="dark-4"
      width={{
        min: "100%",
      }}
      height={{
        min: "100%",
      }}
    >
      <Box>
        <ChatView messages={messages} />
      </Box>
      <Box>
        <ChatInput onSend={async (e) => console.log(e)} />
      </Box>
    </StyledBox>
  );
};

export default Chat;
