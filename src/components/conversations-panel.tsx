import { FunctionComponent, useCallback, useContext, useEffect } from "react";
import type { ConnectionStatus, Settings as TSettings } from "../state";
import { useState } from "react";
import { Box, List, Text, Layer, ResponsiveContext } from "grommet";
import { Add, SettingsOption, BarChart } from "grommet-icons";
import IconButton from "./icon-button";
import Settings from "./settings";
import Analytics from "./analytics";
import NewConversation from "./new-conversation";
import Logo from "./logo";
import useAppState from "../state";
import styled from "styled-components";
import theme from "../theme";

const Notifications = styled(Box)`
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  content: ' ';
  border-radius: 50%;
  position: absolute;
  right: 5px;
`;

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
  const [hasUpdatedSettings, setHasUpdatedSettings] = useState<boolean>(false);
  const [isMaybeOnline, setMaybeOnline] = useState<boolean>(false);
  const [isReallyOnline, setReallyOnline] = useState<boolean>(false);
  const {version, hash, environment} = useAppState();
  
  const screenSize = useContext(ResponsiveContext);
  const isMobile = screenSize === "small";

  useEffect(() => {
    setReallyOnline(isMaybeOnline && status === 'CONNECTED');
  }, [isMaybeOnline])

  useEffect(() => {
    // NB: Status gets called multiple times when `apiToken` is wrong. If that's the case, we make sure
    // to reset the value of `isReallyOnline` by triggering `setMaybeOnline` to `false` whenever
    // we see `status` === 'DISCONNECTED`. We use `hasUpdatedSettings` to tell the <Settings> component
    // that we have updated the Settings at least once.
    if (isMaybeOnline && status === 'CONNECTED') {
      setReallyOnline(true)
    // NB: If settings are passed via query param or loaded via mocks, then the connection is successful
    // This only happens if the settings have not been updated ie during first load.
    } else if (!hasUpdatedSettings && status === 'CONNECTED') {
      setReallyOnline(true)
    } else {
      setMaybeOnline(false);
      setReallyOnline(false);
    }
  }, [status])

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
          wrap={true}
        >
          <Box direction="row">
            <IconButton
              pad="small"
              alignSelf="end"
              round
              onClick={() => setShowSettings(true)}
              margin="0"
              style={{ position: "relative" }}
            >
              <Notifications color={!isReallyOnline ? theme.global.colors["fatal-error"] : theme.global.colors["status-success"]}/>
              <SettingsOption color="light-1" />
            </IconButton>
            <IconButton
              pad="small"
              alignSelf="end"
              round
              disabled={!isReallyOnline}
              onClick={() => setShowAnalytics(true)}
              margin="0"
            >
              <BarChart color="light-1" />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              aria-label="Add Peer Id"
              pad="small"
              alignSelf="end"
              round
              disabled={!isReallyOnline}
              onClick={() => setShowAddNewConv(true)}
              margin="0"
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
          <Logo isOnline={isReallyOnline} />
          <Text style={{ margin: "5px 0 0" }} size="xs">Version: {version}</Text>
          { environment != 'production' && <Text style={{ margin: "5px 0 0" }} size="xs">Hash: {hash}</Text> }
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
            setHasUpdatedSettings={setHasUpdatedSettings}
            setMaybeOnline={setMaybeOnline}
            isReallyOnline={isReallyOnline}
            hasUpdatedSettings={hasUpdatedSettings}
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
