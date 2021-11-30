import type { FunctionComponent } from "react";
import type { Message } from "../state";
import { Box, InfiniteScroll } from "grommet";
import ChatBubble from "./chat-bubble";

const ChatView: FunctionComponent<{ messages: Message[] }> = ({ messages }) => {
  // ASC
  const sorted = messages.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  return (
    <Box
      height="100%"
      direction="column-reverse"
      overflow={{
        vertical: "auto",
        horizontal: "hidden",
      }}
    >
      <InfiniteScroll items={sorted} replace>
        {(message: Message, _index: number, ref: any) => (
          <Box
            ref={ref}
            key={message.id}
            alignSelf={message.isIncoming ? "start" : "end"}
            flex={false}
            pad={{
              bottom: "large",
              right: "small",
            }}
          >
            <ChatBubble message={message} />
          </Box>
        )}
      </InfiniteScroll>
    </Box>
  );
};

export default ChatView;
