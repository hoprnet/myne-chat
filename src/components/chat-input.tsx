import type { FunctionComponent, KeyboardEvent } from "react";
import { useState, useContext } from "react";
import { Box, Button, TextArea, ResponsiveContext } from "grommet";

const ChatInput: FunctionComponent<{
  sendMessage: (destination: string, message: string) => void;
  selection?: string;
}> = ({ sendMessage, selection }) => {
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
          label="send"
          shadow
          disabled={disableSend}
          onClick={handleSendMessage}
        />
      </Box>
    </Box>
  );
};

export default ChatInput;
