import type { FunctionComponent } from "react";
import type { Message } from "../mocks";
import { Box, Text } from "grommet";

const ChatBubble: FunctionComponent<{ message: Message }> = ({ message }) => {
  const isIncoming = message.direction === "received";
  const backgroundColor = isIncoming ? "dark-3" : "accent-2";
  const textColor = isIncoming ? "accent-1" : "dark-1";

  return (
    <Box>
      <Text textAlign="end" size="small" color="brand">
        {new Date(message.time).toLocaleString()}
      </Text>
      <Box
        background={backgroundColor}
        round
        pad="small"
        // @ts-ignore
        shadow
      >
        <Text color={textColor} size="medium">
          {message.content}
        </Text>
      </Box>
    </Box>
  );
};

export default ChatBubble;
