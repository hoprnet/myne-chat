import type { FunctionComponent } from "react";
import type { Message } from "../mocks";
import { Box, List } from "grommet";
import { useTheme } from "../theme";
import ChatBubble from "./chat-bubble";

const ChatView: FunctionComponent<{ messages: Message[] }> = ({ messages }) => {
  const theme = useTheme();

  return (
    <List
      primaryKey="id"
      data={messages}
      border={false}
      pad={{
        horizontal: "none",
        bottom: theme.global.raw.space.large,
      }}
    >
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
