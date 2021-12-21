import type { FunctionComponent } from "react";
import type { Message } from "../state";
import { Box, Text } from "grommet";
import { Copy } from "grommet-icons";
import ChatInput from "./chat-input";
import IconButton from "./icon-button";

const Chat: FunctionComponent<{
  chatContent: JSX.Element,
  sendMessage: (destination: string, message: string) => void;
  messages: Message[];
  selection?: string;
}> = ({ chatContent, selection, messages, sendMessage }) => {
  return (
    <Box fill justify="between" background="dark-4" round shadow>
      {selection ? (
        <Box
          shadow
          round
          pad="medium"
          background="dark-3"
          justify="between"
          direction="row"
        >
          <Box
            direction="row"
            justify="start"
            align="center"
            height={{
              min: "min-content",
              height: "100px",
            }}
          >
            <Text>User Peer ID: {selection}</Text>
            <IconButton
              onClick={() => navigator.clipboard.writeText(selection)}
            >
              <Copy />
            </IconButton>
          </Box>
        </Box>
      ) : null}
      <Box fill gap="small" pad="small">
        <Box fill>
          {chatContent}
        </Box>
        <Box
          height={{
            min: "min-content",
          }}
        >
          <ChatInput sendMessage={sendMessage} selection={selection} />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
