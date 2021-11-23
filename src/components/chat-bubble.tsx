import type { FunctionComponent } from "react";
import type { Message } from "../state";
import { Box, Text } from "grommet";

const ChatBubble: FunctionComponent<{ message: Message }> = ({ message }) => {
  const backgroundColor = message.isIncoming ? "dark-3" : "accent-2";
  const textColor = message.isIncoming ? "accent-1" : "dark-1";

  return (
    <Box>
      <Text textAlign="end" size="small" color="brand">
        {new Date(message.createdAt).toLocaleString()}
      </Text>
      <Box background={backgroundColor} pad="small" round shadow>
        <Text color={textColor} size="medium">
          {message.content}
        </Text>
      </Box>
    </Box>
  );
};

export default ChatBubble;
