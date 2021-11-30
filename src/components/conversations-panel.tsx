import type { FunctionComponent } from "react";
import { useState } from "react";
import { Box, List, Text, Sidebar, Nav, Layer } from "grommet";
import IconButton from "./icon-button";
import NewConversation from "./new-conversation";
import Logo from "./logo";

const ConversationsPanel: FunctionComponent<{
  counterparties: string[];
  selection?: string;
  onSelect: (p: string) => void;
  onNewConversation: (p: string) => void;
}> = ({ counterparties, selection, onSelect, onNewConversation }) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <Sidebar
      header={
        <Box pad="small">
          <IconButton
            pad="small"
            alignSelf="end"
            round
            onClick={() => setShow(true)}
          >
            <Text>+</Text>
          </IconButton>
        </Box>
      }
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
      <Nav>
        <List
          data={counterparties}
          border={false}
          pad={{
            horizontal: "none",
            bottom: "small",
          }}
          onClickItem={(props: any) => onSelect(props.item)}
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
      </Nav>
      {show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
          background="none"
        >
          <NewConversation
            counterparties={counterparties}
            onSend={(p) => {
              onNewConversation(p);
              setShow(false);
            }}
          />
        </Layer>
      )}
    </Sidebar>
  );
};

export default ConversationsPanel;
