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
      <Box>
        <Text>
          Your Peer ID: {myPeerId}
          <IconButton onClick={() => navigator.clipboard.writeText(myPeerId)}>
            <Copy />
          </IconButton>
        </Text>
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
          <Box shadow round pad="large" background="dark-4">
            <TextInput
              value={draft.httpEndpoint}
              onChange={HandleSetDraftSetting("httpEndpoint")}
            />
            <TextInput
              value={draft.wsEndpoint}
              onChange={HandleSetDraftSetting("wsEndpoint")}
            />
            <Button label="save" onClick={handleSave} />
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default PersonalPanel;
