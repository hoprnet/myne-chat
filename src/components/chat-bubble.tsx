import type { FunctionComponent } from "react";
import type { Message } from "../mocks";
import { Box, Text } from "grommet";
import { normalizeColor } from "grommet/utils";
import { useTheme } from "../theme";

const ChatBubble: FunctionComponent<{ message: Message }> = ({ message }) => {
  const isIncoming = message.direction === "received";
  const theme = useTheme();
  const backgroundColor = normalizeColor(
    isIncoming ? "dark-3" : "accent-2",
    theme
  );
  const textColor = normalizeColor(isIncoming ? "accent-1" : "dark-1", theme);

  return (
    <Box>
      <Text color="brand" textAlign="end" size="small">
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
