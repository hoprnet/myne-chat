import type { FunctionComponent } from "react";
import type { Message } from "../mocks";
import { Box, List } from "grommet";
import ChatBubble from "./chat-bubble";

const ChatView: FunctionComponent<{ messages: Message[] }> = ({ messages }) => {
  return (
    <List primaryKey="id" data={messages} border={false}>
      {(message: Message) => {
        const isIncoming = message.direction === "received";

        return (
          <Box alignSelf={isIncoming ? "start" : "end"}>
            <ChatBubble key={message.id} message={message} />
          </Box>
        );
      }}
    </List>
  );
};

export default ChatView;
