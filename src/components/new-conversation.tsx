import type { FunctionComponent } from "react";
import { useState } from "react";
import { Box, TextInput, Button, Text } from "grommet";
import { PEER_ID_LENGTH, isValidPeerId } from "../utils";

const NewConversation: FunctionComponent<{
  currentPeerIds: string[];
  onSend: (p: string) => void;
}> = ({ currentPeerIds, onSend }) => {
  const [peerId, setPeerId] = useState<string>("");
  const validPeerId = isValidPeerId(peerId);
  const alreadyExists = currentPeerIds.includes(peerId);

  return (
    <Box shadow round pad="large" background="dark-4">
      <Text size="large">START A CONVERSATION</Text>
      <Text size="small">
        Start a conversation with someone by entering their Peer ID:
      </Text>
      <Box direction="row">
        <TextInput
          value={peerId}
          onChange={(e) => setPeerId(e.target.value)}
          maxLength={PEER_ID_LENGTH}
        />
        <Button
          label="send"
          onClick={() => onSend(peerId)}
          disabled={!validPeerId || alreadyExists}
        />
      </Box>
      {alreadyExists ? (
        <Text size="small" color="status-error" textAlign="end">
          PeerID already exists
        </Text>
      ) : null}
    </Box>
  );
};

export default NewConversation;
