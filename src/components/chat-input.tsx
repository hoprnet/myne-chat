import type { FunctionComponent, KeyboardEvent } from "react";
import { useState, useContext } from "react";
import { Box, Button, TextArea, ResponsiveContext } from "grommet";

const ChatInput: FunctionComponent<{
  onSend: (message: string) => Promise<string | void>;
  selectedCounterparty?: string;
}> = ({ onSend, selectedCounterparty }) => {
  const size = useContext(ResponsiveContext);
  const direction = size === "small" ? "column" : "row";
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<
    "PENDING" | "SUCCESS" | "ERROR" | undefined
  >();
  const [content, setMessage] = useState<string>("");
  const disableInput = !selectedCounterparty;
  const disableSend = status === "PENDING" || content.length === 0;

  const handleSend = () => {
    setError(undefined);
    setStatus("PENDING");

    onSend(content)
      .then(() => {
        setStatus("SUCCESS");
        setMessage("");
      })
      .catch((err) => {
        setStatus("ERROR");
        setError(err);
      });
  };

  const handleEnterPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      handleSend();
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
          onClick={handleSend}
        />
      </Box>
    </Box>
  );
};

export default ChatInput;
