import type { FunctionComponent } from "react";
import { useState } from "react";
import { Box, Button, TextArea, ResponsiveContext } from "grommet";
import { useTheme } from "../theme";

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
          <Box
            background="light-2"
            direction={direction}
            justify="between"
            round
            pad="none"
            // @ts-ignore
            shadow
          >
            <Box
              flex={{
                grow: 1,
              }}
            >
              <TextArea
                color="dark-1"
                size="medium"
                resize={false}
                fill
                value={content}
                onChange={(e) => updateMessage(e.target.value)}
              />
            </Box>
            <Box
              pad={{
                horizontal: "small",
                vertical: "medium",
              }}
            >
              <Button label="send" />
            </Box>
          </Box>
        );
      }}
    </ResponsiveContext.Consumer>
  );
};

export default ChatInput;
