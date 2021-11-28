import type { FunctionComponent } from "react";
import type { Message } from "../state";
import { Box } from "grommet";
import ChatView from "./chat-view";
import ChatInput from "./chat-input";

const Chat: FunctionComponent<{
  selectedCounterparty?: string;
  messages?: Message[];
  onSend: (message: string) => Promise<string | void>;
}> = ({ selectedCounterparty, messages = [], onSend }) => {
  return (
    <Box
      justify="between"
      width="100%"
      height="100%"
      background="dark-4"
      pad="small"
      gap="small"
      round
      shadow
    >
      <Box width="100%" height="100%">
        <ChatView messages={messages} />
      </Box>
      <Box>
        <ChatInput
          onSend={onSend}
          selectedCounterparty={selectedCounterparty}
        />
      </Box>
    </Box>
  );
};

export default Chat;
