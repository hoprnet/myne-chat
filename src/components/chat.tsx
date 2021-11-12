import type { FunctionComponent } from "react";
import type { Conversation } from "../state";
import { Box } from "grommet";
import ChatView from "./chat-view";
import ChatInput from "./chat-input";

const Chat: FunctionComponent<{
  conversation?: Conversation;
  onSend: (message: string) => Promise<string | void>;
}> = ({ conversation, onSend }) => {
  const messages = conversation?.messages
    ? Array.from(conversation.messages.values())
    : [];

  return (
    <Box
      justify="between"
      width={{
        min: "100%",
      }}
      height={{
        min: "100%",
      }}
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
