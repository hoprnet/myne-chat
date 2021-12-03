import type { FunctionComponent } from "react";
import type { Message, Settings } from "../state";
import { Box } from "grommet";
import PersonalPanel from "./personal-panel";
import ChatView from "./chat-view";
import ChatInput from "./chat-input";

const Chat: FunctionComponent<{
  updateSettings: (settings: Partial<Settings>) => void;
  sendMessage: (destination: string, message: string) => void;
  settings: Settings;
  messages: Message[];
  myPeerId?: string;
  selection?: string;
}> = ({
  myPeerId,
  settings,
  selection,
  messages,
  sendMessage,
  updateSettings,
}) => {
  return (
    <Box fill justify="between" background="dark-4" round shadow>
      <Box>
        <PersonalPanel
          myPeerId={myPeerId ?? "unknown"}
          settings={settings}
          updateSettings={updateSettings}
        />
      </Box>
      <Box fill gap="small" pad="small">
        <Box fill>
          <ChatView messages={messages} />
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
