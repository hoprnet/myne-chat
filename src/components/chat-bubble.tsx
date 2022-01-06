import type { FunctionComponent } from "react";
import type { Message } from "../state";
import { Box, Text, Tip } from "grommet";
import { StatusWarning, StatusGood } from "grommet-icons";

const ChatBubble: FunctionComponent<{ message: Message }> = ({ message }) => {
  const backgroundColor = message.isIncoming ? "dark-3" : "accent-2";
  const textColor = message.isIncoming ? "accent-1" : "dark-1";

  return (
    <Box>
      <Text textAlign="end" size="small" color="brand">
        {new Date(message.createdAt).toLocaleString()}
      </Text>
      <Box background={backgroundColor} pad="small" round shadow>
        <Text color={textColor} size="medium" wordBreak="break-word">
          {message.verified && (
            <Tip content="The message was signed by the sender.">
              <StatusGood style={{ marginRight: '5px' }} size="small" color="status-success" />
            </Tip>
          )}
          {message.content}{" "}
          {message.status === "FAILURE" ? (
            <Tip content={message.error}>
              <StatusWarning color="status-error" />
            </Tip>
          ) : null}
        </Text>
      </Box>
    </Box>
  );
};

export default ChatBubble;
