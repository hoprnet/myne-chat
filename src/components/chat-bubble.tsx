import type { FunctionComponent } from "react";
import type { Theme } from "../theme";
import type { Message } from "../mocks";
import { useContext } from "react";
import { ThemeContext, Text } from "grommet";
import Box from "./styled-box";
import { normalizeColor } from "grommet/utils";

const ChatBubble: FunctionComponent<{ message: Message }> = ({ message }) => {
  const isIncoming = message.direction === "received";
  // TODO: there must be a better way to access theme
  const theme = useContext<Theme>(ThemeContext as any);
  const backgroundColor = isIncoming
    ? normalizeColor("dark-3", theme)
    : normalizeColor("accent-2", theme);
  const textColor = isIncoming ? "white" : "black";

  return (
    <Box align={isIncoming ? "start" : "end"} background={backgroundColor}>
      <Text
        tip={{
          content: new Date(message.time).toUTCString(),
        }}
        color={textColor}
      >
        {message.content}
      </Text>
    </Box>
  );
};

export default ChatBubble;
