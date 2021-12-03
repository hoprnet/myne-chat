import type { FunctionComponent } from "react";
import { useState } from "react";
import { Box, TextInput, Button, Text, Heading } from "grommet";
import { PEER_ID_LENGTH, isValidPeerId } from "../utils";

const NewConversation: FunctionComponent<{
  counterparties: string[];
  addNewConversation: (p: string) => void;
}> = ({ counterparties, addNewConversation }) => {
  const [peerId, setPeerId] = useState<string>("");
  const validPeerId = isValidPeerId(peerId);
  const alreadyExists = counterparties.includes(peerId);

  return (
    <Box shadow round pad="large" background="dark-4" gap="medium">
      <Box>
        <Text size="large" textAlign="center">
          START A CONVERSATION
        </Text>
      </Box>
      <Box gap="small">
        <Text size="small">
          Start a conversation with someone by entering their Peer ID:
        </Text>
        <Box direction="row" gap="small">
          <TextInput
            value={peerId}
            onChange={(e) => setPeerId(e.target.value)}
            maxLength={PEER_ID_LENGTH}
          />
          <Button
            label="send"
            onClick={() => addNewConversation(peerId)}
            disabled={!validPeerId || alreadyExists}
          />
        </Box>
        {alreadyExists ? (
          <Text size="small" color="light-1" textAlign="end">
            PeerID already exists
          </Text>
        ) : null}
      </Box>
    </Box>
  );
};

export default NewConversation;
