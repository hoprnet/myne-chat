import type { FunctionComponent } from "react";
import { useState } from "react";
import { Box, Button, TextArea, ResponsiveContext } from "grommet";

const ChatInput: FunctionComponent<{
  onSend: (message: string) => Promise<string | void>;
}> = () => {
  const [content, updateMessage] = useState<string>("");

  return (
    <ResponsiveContext.Consumer>
      {(size) => {
        const direction = size === "small" ? "column" : "row";

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
                onChange={(e) => updateMessage(e.target.value)}
              />
            </Box>
            <Box
              pad={{
                horizontal: "small",
                vertical: "medium",
              }}
            >
              <Button label="send" shadow />
            </Box>
          </Box>
        );
      }}
    </ResponsiveContext.Consumer>
  );
};

export default ChatInput;
