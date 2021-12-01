import type { FunctionComponent } from "react";
import type { ConnectionStatus } from "../state";
import { useState } from "react";
import { Box, List, Text, Sidebar, Layer } from "grommet";
import { normalizeColor } from "grommet/utils";
import IconButton from "./icon-button";
import NewConversation from "./new-conversation";
import Logo from "./logo";
import Circle from "./circle";

const Header: FunctionComponent<{
  status: ConnectionStatus;
  setShow: (v: boolean) => void;
}> = ({ status, setShow }) => {
  return (
    <Box pad="small" justify="between" direction="row" align="center">
      <Box pad="small">
        <Circle
          size="15px"
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
          <Text>+</Text>
        </IconButton>
      </Box>
    </Box>
  );
};

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
    <Sidebar
      header={<Header status={status} setShow={setShow} />}
      footer={
        <Box pad="small">
          <Logo />
        </Box>
      }
      pad="none"
      gap="small"
      background="dark-3"
      round
      shadow
    >
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
    </Sidebar>
  );
};

export default ConversationsPanel;
