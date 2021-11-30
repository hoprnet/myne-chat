import type { FunctionComponent } from "react";
import { useCallback } from "react";
import { Box, Text } from "grommet";
import { Copy } from "grommet-icons";
import IconButton from "./icon-button";

const PersonalPanel: FunctionComponent<{
  myPeerId: string;
}> = ({ myPeerId }) => {
  const copyToClipboard = useCallback(() => {
    console.log("copy");
    navigator.clipboard.writeText(myPeerId);
  }, [myPeerId]);

  return (
    <Box shadow round pad="medium" background="dark-3">
      <Text>
        Your Peer ID: {myPeerId}
        <IconButton onClick={copyToClipboard}>
          <Copy />
        </IconButton>
      </Text>
    </Box>
  );
};

export default PersonalPanel;
