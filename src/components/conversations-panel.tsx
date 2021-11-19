import type { FunctionComponent } from "react";
import type { Conversation } from "../state";
import { useState } from "react";
import { Box, List, Text, Sidebar, Nav, Layer } from "grommet";
import IconButton from "./icon-button";
import NewConversation from "./new-conversation";
import Logo from "./logo";

const ConversationsPanel: FunctionComponent<{
  conversations: Conversation[];
  selected?: Conversation;
  onSelect: (p: string) => void;
  onNewConversation: (p: string) => void;
}> = ({ conversations, selected, onSelect, onNewConversation }) => {
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
      {show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
          background="none"
        >
          <NewConversation
            currentPeerIds={conversations.map((c) => c.with)}
            onSend={(p) => {
              onNewConversation(p);
              setShow(false);
            }}
          />
        </Layer>
      )}
      <Nav>
        <List
          primaryKey="with"
          data={conversations}
          border={false}
          pad={{
            horizontal: "none",
            bottom: "small",
          }}
          onClickItem={(props: any) => onSelect(props.item.with)}
        >
          {(conv: Conversation, index: number, isActive: string) => {
            const isSelected = conv.with === selected?.with;

            return (
              <Box background={isSelected ? "white" : undefined}>
                <Text
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {conv.with}
                </Text>
              </Box>
            );
          }}
        </List>
      </Nav>
    </Sidebar>
  );
};

export default ConversationsPanel;
