import type { NextPage } from "next";
import { useState, useContext, useEffect } from "react";
import { Box, Button, ResponsiveContext } from "grommet";
import { LinkPrevious } from "grommet-icons";
import { useAppState } from "../src/state";
import { encodeMessage, decodeMessage } from "../src/utils";
import ConversationsPanel from "../src/components/conversations-panel";
import PersonalPanel from "../src/components/personal-panel";
import Chat from "../src/components/chat";

const HomePage: NextPage = () => {
  const { state: {
    selection,
    conversations,
    myPeerId,
    httpEndpoint,
  }, socketRef, setSelection, newConversation, sentMessage, receivedMessage } = useAppState()

  // get selected conversation
  // TODO: use memo?
  const conversation = selection
    ? conversations.get(selection)
    : undefined;

  const [focus, setFocus] = useState<"conversations-panel" | "chat">(
    "conversations-panel"
  );
  const isSmall = useContext(ResponsiveContext) === "small";
  const showConvsOnly = isSmall && focus === "conversations-panel";
  const showChatOnly = isSmall && focus === "chat";

  useEffect(() => {
    console.log("will add e")

    if (!myPeerId || !socketRef.current) return;
    console.log("added e")

    socketRef.current.addEventListener("message", (event) => {
      try {
        const { from, message } = decodeMessage(event.data);
        receivedMessage(from, message);
      } catch (err) {
        console.error(err);
      }
    });
  }, [socketRef.current, myPeerId]);

  const handleSelect = (selection: string) => {
    setSelection(selection);
    setFocus("chat");
  };

  const handleSend = async (message: string) => {
    if (!myPeerId || !selection || !socketRef.current)
      return;

    const encodedMessage = encodeMessage(myPeerId, message);
    sentMessage(myPeerId, selection, message);
    await fetch(`${httpEndpoint}/send_message`, {
      method: "POST",
      body: JSON.stringify({
        destination: selection,
        message: encodedMessage,
      }),
    });
  };

  const handleNewConversation = (newCounterparty: string) => {
    newConversation(newCounterparty);
    setFocus("chat");
  };

  return (
    <Box fill direction="row" justify="between" pad="small">
      <Box
        width={isSmall ? "100%" : "250px"}
        pad={{ right: isSmall ? undefined : "small" }}
        style={{
          display: showChatOnly ? "none" : undefined,
        }}
      >
        <ConversationsPanel
          counterparties={Array.from(conversations.keys())}
          selectedCounterparty={selection}
          onSelect={handleSelect}
          onNewConversation={handleNewConversation}
        />
      </Box>
      <Box
        width="100%"
        height="100%"
        direction="column"
        justify="between"
        style={{
          display: showConvsOnly ? "none" : undefined,
        }}
        gap="small"
      >
        {isSmall ? (
          <Button
            icon={<LinkPrevious />}
            onClick={() => setFocus("conversations-panel")}
          />
        ) : null}
        <PersonalPanel myPeerId={myPeerId ?? "unknown"} />
        <Chat
          selectedCounterparty={selection}
          messages={conversation ? Array.from(conversation.values()) : []}
          onSend={handleSend}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
