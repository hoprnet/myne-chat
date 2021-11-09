import type { FunctionComponent } from "react";
import { Box } from "grommet";
import { messages } from "../mocks";
import StyledBox from "./styled-box";
import ChatView from "./chat-view";
import ChatInput from "./chat-input";

const Chat: FunctionComponent = () => {
  return (
    <StyledBox justify="around" background="dark-4">
      <Box gridArea="chat-view">
        <ChatView messages={messages} />
      </Box>
      <Box gridArea="chat-view">
        <ChatInput onSend={async (e) => console.log(e)} />
      </Box>
    </StyledBox>
  );
};

export default Chat;
