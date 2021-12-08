import type { FunctionComponent, ChangeEvent } from "react";
import type { Settings as TSettings } from "../state";
import { useState } from "react";
import { Box, TextInput, Button } from "grommet";

const Settings: FunctionComponent<{
  settings: TSettings;
  updateSettings: (o: TSettings) => void;
}> = ({ settings, updateSettings }) => {
  const [draft, setDraft] = useState<TSettings>({
    httpEndpoint: settings.httpEndpoint,
    wsEndpoint: settings.wsEndpoint,
  });

  const HandleSetDraftSetting = <K extends keyof TSettings>(k: K) => {
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
  };

  return (
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
      </Box>
      <Button label="save" onClick={handleSave} />
    </Box>
  );
};

export default Settings;
