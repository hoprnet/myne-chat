import type { FunctionComponent, KeyboardEvent } from "react";
import { useState, useContext } from "react";
import {
  Box,
  Button,
  TextArea,
  ResponsiveContext,
  CheckBox,
  Tip,
} from "grommet";

const ChatInput: FunctionComponent<{
  sendMessage: (destination: string, message: string) => void;
  selection?: string;
  setVerified: (verified: boolean) => void;
  verified: boolean;
}> = ({ sendMessage, selection, setVerified, verified }) => {
  const screenSize = useContext(ResponsiveContext);
  const [content, setMessage] = useState<string>("");
  const direction = screenSize === "small" ? "column" : "row";
  const disableInput = !selection;
  const disableSend = !selection || content.length === 0;

  const handleSendMessage = () => {
    if (disableSend) return;
    sendMessage(selection, content);
    setMessage("");
  };

  const handleEnterPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      direction={direction}
      justify="between"
      round
      background="light-2"
      pad="none"
      shadow
    >
      <Box
        flex={{
          grow: 1,
        }}
      >
        <TextArea
          fill
          name="Chat input"
          aria-label="Chat input"
          resize={false}
          size="medium"
          color="dark-1"
          value={content}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleEnterPress}
          disabled={disableInput}
        />
      </Box>
      <Box
        pad={{
          horizontal: "small",
          vertical: "medium",
        }}
      >
        <Button
          name="Send message"
          aria-label="Send message"
          label="send"
          shadow
          disabled={disableSend}
          onClick={handleSendMessage}
        />
        <Tip
          content="Your messages will be signed with your node's key."
          dropProps={{
            align: {
              right: "left",
            },
          }}
        >
          <Box margin="xxsmall">
            <CheckBox
              pad={{ top: "10px" }}
              checked={verified}
              label="Verify?"
              onChange={(event) => setVerified(event.target.checked)}
            />
          </Box>
        </Tip>
      </Box>
    </Box>
  );
};

export default ChatInput;
