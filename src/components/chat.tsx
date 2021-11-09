import type { FunctionComponent } from "react";
import type { Message } from "../mocks";
import { Box } from "grommet";
import ChatView from "./chat-view";
import ChatInput from "./chat-input";

const messages: Message[] = [
  {
    id: "1",
    time: +new Date("01/01/2021"),
    content: "hello world",
    direction: "received",
  },
  {
    id: "2",
    time: +new Date("01/02/2021"),
    content: "hello back",
    direction: "sent",
  },
];

const Chat: FunctionComponent = () => {
  return (
    <Box justify="around">
      <Box gridArea="chat-view">
        <ChatView messages={messages} />
      </Box>
      <Box gridArea="chat-view">
        <ChatInput onSend={async (e) => console.log(e)} />
      </Box>
    </Box>
  );
};

export default Chat;
