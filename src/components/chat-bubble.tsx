import type { FunctionComponent } from "react";
import type { Message } from "../state";
import { Box, Text, Tip } from "grommet";
import { StatusWarning, StatusGood, StatusInfo, StatusCritical } from "grommet-icons";

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
          {message.verifiedStatus == 'VERIFIED' ? (
            <Tip content="Authenticity of the sender successfully verified.">
              <StatusGood style={{ marginRight: '5px' }} size="small" color="status-success" />
            </Tip>
          ) : message.verifiedStatus == 'UNVERIFIED' ? (
            <Tip content="Authenticity of the sender cannot be verified. Could be sent by anyone.">
              <StatusInfo style={{ marginRight: '5px' }} size="small" color="status-disabled" />
            </Tip>
          ) : message.verifiedStatus == 'FAILED_VERIFICATION' ? (
            <Tip content="Authenticity of the sender cannot be verified because the authenticity tag is missing. Could be sent by anyone.">
              <StatusCritical style={{ marginRight: '5px' }} size="small" color="fatal-error" />
            </Tip>
          ) : null}
          {message.hasHTML ? <span dangerouslySetInnerHTML={{__html: message.content}} /> : message.content}
          {" "}
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
