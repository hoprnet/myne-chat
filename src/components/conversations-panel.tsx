import type { FunctionComponent } from "react";
import type { ConnectionStatus, Settings as TSettings } from "../state";
import { useState } from "react";
import { Box, List, Text, Layer } from "grommet";
import { Add, SettingsOption, BarChart } from "grommet-icons";
import IconButton from "./icon-button";
import Settings from "./settings";
import Analytics from "./analytics";
import NewConversation from "./new-conversation";
import Logo from "./logo";

const ConversationsPanel: FunctionComponent<{
  status: ConnectionStatus;
  myPeerId?: string;
  // settings
  settings: TSettings;
  updateSettings: (o: TSettings) => void;
  // selection
  selection?: string;
  setSelection: (p: string) => void;
  // conversations
  counterparties: string[];
  addNewConversation: (p: string) => void;
}> = ({
  status,
  myPeerId,
  settings,
  updateSettings,
  selection,
  setSelection,
  counterparties,
  addNewConversation,
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [showAddNewConv, setShowAddNewConv] = useState<boolean>(false);

  return (
    <>
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
          <Box direction="row">
            <IconButton
              pad="small"
              alignSelf="end"
              round
              onClick={() => setShowSettings(true)}
            >
              <SettingsOption color="light-1" />
            </IconButton>
            <IconButton
              pad="small"
              alignSelf="end"
              round
              disabled={status === 'DISCONNECTED'}
              onClick={() => setShowAnalytics(true)}
            >
              <BarChart color="light-1" />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              pad="small"
              alignSelf="end"
              round
              disabled={status === 'DISCONNECTED'}
              onClick={() => setShowAddNewConv(true)}
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
            }}
            // removes focus indicator
            style={{
              outline: 0,
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
                <Box pad="small" background={highlight ? "dark-4" : undefined}>
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
          <Logo status={status} />
        </Box>
      </Box>
      {showSettings ? (
        <Layer
          onEsc={() => setShowSettings(false)}
          onClickOutside={() => setShowSettings(false)}
          background="none"
        >
          <Settings
            settings={settings}
            updateSettings={(s) => {
              setShowSettings(false);
              updateSettings(s);
            }}
          />
        </Layer>
      ) : showAnalytics ? (
        <Layer
          onEsc={() => setShowAnalytics(false)}
          onClickOutside={() => setShowAnalytics(false)}
          background="none"
        >
          <Analytics myPeerId={myPeerId} />
        </Layer>
      ) : showAddNewConv ? (
        <Layer
          onEsc={() => setShowAddNewConv(false)}
          onClickOutside={() => setShowAddNewConv(false)}
          background="none"
        >
          <NewConversation
            myPeerId={myPeerId}
            counterparties={counterparties}
            addNewConversation={(p) => {
              addNewConversation(p);
              setShowAddNewConv(false);
            }}
          />
        </Layer>
      ) : null}
    </>
  );
};

export default ConversationsPanel;
