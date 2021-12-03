import type { FunctionComponent, ChangeEvent } from "react";
import type { Settings } from "../state";
import { useState } from "react";
import { Box, Text, Layer, TextInput, Button } from "grommet";
import { Copy, SettingsOption } from "grommet-icons";
import IconButton from "./icon-button";

const PersonalPanel: FunctionComponent<{
  myPeerId: string;
  settings: Settings;
  updateSettings: (o: Settings) => void;
}> = ({ myPeerId, settings, updateSettings }) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [draft, setDraft] = useState<Settings>({
    httpEndpoint: settings.httpEndpoint,
    wsEndpoint: settings.wsEndpoint,
  });

  const HandleSetDraftSetting = <K extends keyof Settings>(k: K) => {
    return (ev: ChangeEvent<HTMLInputElement>) => {
      setDraft((s) => ({
        ...s,
        [k]: ev.target.value,
      }));
    };
  };

  const handleSave = () => {
    updateSettings({
      httpEndpoint: draft.httpEndpoint,
      wsEndpoint: draft.wsEndpoint,
    });
    setShowSettings(false);
  };

  return (
    <Box
      shadow
      round
      pad="medium"
      background="dark-3"
      justify="between"
      direction="row"
    >
      <Box
        direction="row"
        justify="start"
        align="center"
        height={{
          min: "min-content",
          height: "100px",
        }}
      >
        <Text>Your Peer ID: {myPeerId}</Text>
        <IconButton onClick={() => navigator.clipboard.writeText(myPeerId)}>
          <Copy />
        </IconButton>
      </Box>
      <Box>
        <IconButton onClick={() => setShowSettings(true)}>
          <SettingsOption />
        </IconButton>
      </Box>
      {showSettings && (
        <Layer
          onEsc={() => setShowSettings(false)}
          onClickOutside={() => setShowSettings(false)}
          background="none"
        >
          <Box shadow round pad="large" background="dark-4" gap="medium">
            <Box>
              HTTP endpoint:
              <TextInput
                placeholder="http://localhost:8080"
                value={draft.httpEndpoint}
                onChange={HandleSetDraftSetting("httpEndpoint")}
              />
            </Box>
            <Box>
              WS endpoint:
              <TextInput
                placeholder="ws://localhost:8081"
                value={draft.wsEndpoint}
                onChange={HandleSetDraftSetting("wsEndpoint")}
              />
              <Button label="save" onClick={handleSave} />
            </Box>
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default PersonalPanel;
