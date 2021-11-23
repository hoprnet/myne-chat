import type { FunctionComponent } from "react";
import { Box, Text } from "grommet";
import { Copy } from "grommet-icons";
import IconButton from "./icon-button";

const PersonalPanel: FunctionComponent<{
  myPeerId: string;
}> = ({ myPeerId }) => {
  return (
    <Box shadow round pad="medium" background="dark-3">
      <Text>
        Your Peer ID: {myPeerId}
        <IconButton
          pad="small"
          alignSelf="end"
          round
          flex
          margin={{ left: "small" }}
          onClick={() => navigator.clipboard.writeText(myPeerId)}
        >
          <Copy />
        </IconButton>
      </Text>
    </Box>
  );
};

export default PersonalPanel;
