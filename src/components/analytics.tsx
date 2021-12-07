import type { FunctionComponent } from "react";
import { Box, Text } from "grommet";
import { Copy } from "grommet-icons";
import IconButton from "./icon-button";

const Analytics: FunctionComponent<{
  myPeerId?: string;
}> = ({ myPeerId }) => {
  return (
    <Box shadow round pad="large" background="dark-4" gap="medium">
      <Box align="center">
        <Text>Your Peer ID</Text>
        <br />
        <Text>{myPeerId}</Text>
        <IconButton
          onClick={() => navigator.clipboard.writeText(myPeerId || "")}
          disabled={!myPeerId}
        >
          <Copy />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Analytics;
