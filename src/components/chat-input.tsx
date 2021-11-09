import type { FunctionComponent } from "react";
import type { Theme } from "../theme";
import { useState, useContext } from "react";
import { Box, Button, TextArea, ThemeContext } from "grommet";
import StyledBox from "./styled-box";

const ChatInput: FunctionComponent<{
  onSend: (message: string) => Promise<string | void>;
}> = () => {
  const theme = useContext<Theme>(ThemeContext as any);
  const [content, updateMessage] = useState<string>("");

  return (
    <StyledBox
      background={theme.global.colors["light-2"]}
      direction="row"
      justify="around"
    >
      <Box width="100%" height="100%">
        <TextArea
          color={theme.global.colors["dark-1"]}
          resize={false}
          fill
          onChange={(e) => updateMessage(e.target.value)}
          value={content}
        />
      </Box>
      <Box
        pad={{
          horizontal: theme.global.raw.space.small,
          vertical: theme.global.raw.space.medium,
        }}
      >
        <Button label="send" />
      </Box>
    </StyledBox>
  );
};

export default ChatInput;
