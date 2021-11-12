import type { FunctionComponent } from "react";
import type { Conversation } from "../state";
import { Box, List, Text, Sidebar, Nav } from "grommet";
import Logo from "./logo";

const Statistics: FunctionComponent<{
  conversations: Conversation[];
  selected?: Conversation;
  onSelect: (p: string) => void;
}> = ({ conversations, selected, onSelect }) => {
  return (
    <Sidebar
      header={<Box pad="small">+</Box>}
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

export default Statistics;
