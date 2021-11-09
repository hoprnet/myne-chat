import type { FunctionComponent } from "react";
import { useState } from "react";
import { Box, Button, TextArea, ResponsiveContext } from "grommet";
import { useTheme } from "../theme";
import StyledBox from "./styled-box";

const ChatInput: FunctionComponent<{
  onSend: (message: string) => Promise<string | void>;
}> = () => {
  const [content, updateMessage] = useState<string>("");
  const theme = useTheme();

  return (
    <ResponsiveContext.Consumer>
      {(size) => {
        const direction = size === "small" ? "column" : "row";

        return (
          <StyledBox
            background="light-2"
            direction={direction}
            justify="between"
            pad="none"
          >
            <Box
              flex={{
                grow: 1,
              }}
            >
              <TextArea
                color="dark-1"
                size="medium"
                style={{
                  caretColor: theme.global.colors.brand,
                }}
                resize={false}
                fill
                value={content}
                onChange={(e) => updateMessage(e.target.value)}
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
      }}
    </ResponsiveContext.Consumer>
  );
};

export default ChatInput;
