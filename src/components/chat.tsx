import type { FunctionComponent } from "react";
import { Box } from "grommet";
import { messages } from "../mocks";
import ChatView from "./chat-view";
import ChatInput from "./chat-input";

const Chat: FunctionComponent = () => {
  return (
    <Box
      justify="between"
      width={{
        min: "100%",
      }}
      height={{
        min: "100%",
      }}
      round
      pad="medium"
      background="dark-4"
      // @ts-ignore
      shadow
    >
      <Box>
        <ChatView messages={messages} />
      </Box>
      <Box>
        <ChatInput onSend={async (e) => console.log(e)} />
      </Box>
    </Box>
  );
};

export default Chat;
