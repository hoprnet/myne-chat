import type { FunctionComponent } from "react";
import { useState } from "react";
import { Box, TextInput, Button, Text } from "grommet";
import { PEER_ID_LENGTH, isValidPeerId } from "../utils";

const NewConversation: FunctionComponent<{
  myPeerId: string | undefined;
  counterparties: string[];
  addNewConversation: (p: string) => void;
}> = ({ myPeerId, counterparties, addNewConversation }) => {
  const [peerId, setPeerId] = useState<string>("");
  const validPeerId = isValidPeerId(peerId);

  /*
  Rejections have priority, so a SAME_PEER_ID rejection will show first
  over any other rejections. To change which rejection should go first, just
  change the order of the rejections.

  We added types to enforce the amount of rejections and ensure unwanted
  casts (e.g. undefined to string) can be avoided in build time.
  */

  type Rejection = 'ALREADY_EXISTS' | 'SAME_PEER_ID'

  const rejection: Rejection | undefined =
    peerId === myPeerId ? 'SAME_PEER_ID' :
      counterparties.includes(peerId) ? 'ALREADY_EXISTS' :
        undefined

  const REJECTIONS = {
    'ALREADY_EXISTS': 'PeerID already exists',
    'SAME_PEER_ID': 'You can not add your own PeerId'
  }

  const hasRejection = Boolean(rejection)

  const rejectedMessage = (msg: string) => (
    <Text size="small" color="light-1" textAlign="end">
      {msg}
    </Text>
  )

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
            disabled={!validPeerId || hasRejection}
          />
        </Box>
        {rejection && rejectedMessage(REJECTIONS[rejection])}
      </Box>
    </Box>
  );
};

export default NewConversation;
