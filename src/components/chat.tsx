import type { FunctionComponent } from "react";
import type { Message } from "../state";
import { Box } from "grommet";
import ChatView from "./chat-view";
import ChatInput from "./chat-input";

const Chat: FunctionComponent<{
  messages?: Message[];
  onSend: (message: string) => Promise<string | void>;
}> = ({ messages = [], onSend }) => {
  return (
    <Box
      justify="between"
      width="100%"
      height="100%"
      background="dark-4"
      pad="small"
      round
      shadow
    >
      <Box>
        <ChatView messages={messages} />
      </Box>
      <Box>
        <ChatInput onSend={onSend} />
      </Box>
    </Box>
  );
};

export default Chat;
