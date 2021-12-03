import type { FunctionComponent } from "react";
import type { ConnectionStatus } from "../state";
import { useState } from "react";
import { Box, List, Text, Layer } from "grommet";
import { Add } from "grommet-icons";
import IconButton from "./icon-button";
import NewConversation from "./new-conversation";
import Logo from "./logo";
import Circle from "./circle";

const ConversationsPanel: FunctionComponent<{
  status: ConnectionStatus;
  counterparties: string[];
  setSelection: (p: string) => void;
  addNewConversation: (p: string) => void;
  selection?: string;
}> = ({
  status,
  counterparties,
  selection,
  setSelection,
  addNewConversation,
}) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <Box
      fill="vertical"
      justify="between"
      pad="none"
      gap="small"
      background="dark-3"
      round
      shadow
    >
      {/* header */}
      <Box
        pad="small"
        justify="between"
        direction="row"
        align="center"
        height={{
          min: "min-content",
        }}
      >
        <Box pad="small">
          <Circle
            size="20px"
            color={status === "CONNECTED" ? "status-success" : "status-error"}
          />
        </Box>
        <Box>
          <IconButton
            pad="small"
            alignSelf="end"
            round
            onClick={() => setShow(true)}
          >
            <Add color="light-1" />
          </IconButton>
        </Box>
      </Box>
      {/* conversations */}
      <Box fill="vertical">
        <List
          data={counterparties}
          border={false}
          pad={{
            horizontal: "none",
            bottom: "small",
          }}
          onClickItem={(props: any) => setSelection(props.item)}
        >
          {(
            counterparty: string,
            _index: any,
            { active: isHovered }: { active: boolean }
          ) => {
            const isSelected = counterparty === selection;
            const highlight = isHovered || isSelected;

            return (
              <Box background={highlight ? "white" : undefined}>
                <Text
                  style={{
                    direction: "rtl",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {counterparty}
                </Text>
              </Box>
            );
          }}
        </List>
      </Box>
      {/* footer */}
      <Box pad="small" height={{ min: "min-content" }}>
        <Logo />
      </Box>
      {/* add new conversaion popup */}
      {show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
          background="none"
        >
          <NewConversation
            counterparties={counterparties}
            addNewConversation={(p) => {
              addNewConversation(p);
              setShow(false);
            }}
          />
        </Layer>
      )}
    </Box>
  );
};

export default ConversationsPanel;
