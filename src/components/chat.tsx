import type { FunctionComponent } from "react";
import { dev, Message } from "../state";
import { Box, Text } from "grommet";
import { Copy } from "grommet-icons";
import ChatView from "./chat-view";
import ChatInput from "./chat-input";
import IconButton from "./icon-button";
import { MocksServer } from "./mocks-server";

const Chat: FunctionComponent<{
  sendMessage: (destination: string, message: string) => void;
  messages: Message[];
  selection?: string;
  setVerified: (verified: boolean) => void;
  verified: boolean;
  httpEndpoint: string;
}> = ({
  selection,
  messages,
  sendMessage,
  setVerified,
  verified,
  httpEndpoint,
}) => {
  return (
    <Box fill justify="between" background="dark-4" round shadow>
      {selection ? (
        <Box
          shadow
          round
          pad="15px"
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
          {selection == dev && <MocksServer httpEndpoint={httpEndpoint} />}
        </Box>
      ) : null}
      <Box fill gap="small" pad="small">
        <Box fill>
          <ChatView selection={selection} messages={messages} />
        </Box>
        <Box
          height={{
            min: "min-content",
          }}
        >
          <ChatInput
            sendMessage={sendMessage}
            selection={selection}
            setVerified={setVerified}
            verified={verified}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
