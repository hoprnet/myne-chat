import type { FunctionComponent } from "react";
import type { Message } from "../state";
import { Box, List } from "grommet";
import ChatBubble from "./chat-bubble";

const ChatView: FunctionComponent<{ messages: Message[] }> = ({ messages }) => {
  return (
    <List
      primaryKey="id"
      data={messages}
      border={false}
      pad={{
        horizontal: "none",
        bottom: "large",
      }}
    >
      {(message: Message) => {
        return (
          <Box alignSelf={message.isIncoming ? "start" : "end"}>
            <ChatBubble message={message} />
          </Box>
        );
      }}
    </List>
  );
};

export default ChatView;
