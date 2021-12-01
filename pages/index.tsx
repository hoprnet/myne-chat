import type { NextPage } from "next";
import { useState, useContext, useEffect } from "react";
import { Box, Button, ResponsiveContext } from "grommet";
import { LinkPrevious } from "grommet-icons";
import useAppState from "../src/state";
import { encodeMessage, decodeMessage } from "../src/utils";
import ConversationsPanel from "../src/components/conversations-panel";
import PersonalPanel from "../src/components/personal-panel";
import Chat from "../src/components/chat";

const HomePage: NextPage = () => {
  const {
    state: { selection, conversations, myPeerId, settings, status },
    socketRef,
    setSelection,
    addNewConversation,
    addSentMessage,
    addReceivedMessage,
    updateMessage,
    updateSettings,
  } = useAppState();

  // get selected conversation
  const conversation = selection ? conversations.get(selection) : undefined;

  // currently focused element (used in mobile mode)
  const [focus, setFocus] = useState<"conversations-panel" | "chat">(
    "conversations-panel"
  );
  const screenSize = useContext(ResponsiveContext);
  const isSmall = screenSize === "small";
  const showConvsOnly = isSmall && focus === "conversations-panel";
  const showChatOnly = isSmall && focus === "chat";

  const handleReceivedMessage = (ev: MessageEvent<string>) => {
    try {
      const { from, message } = decodeMessage(ev.data);
      addReceivedMessage(from, message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetSelection = (counterparty: string) => {
    setSelection(counterparty);
    setFocus("chat");
  };

  const handleSendMessage = (destination: string, message: string) => {
    if (!myPeerId || !selection || !socketRef.current) return;

    const encodedMessage = encodeMessage(myPeerId, message);
    const id = addSentMessage(myPeerId, destination, message);
    fetch(`${settings.httpEndpoint}/send_message`, {
      method: "POST",
      body: JSON.stringify({
        destination: selection,
        message: encodedMessage,
      }),
    })
      .then(() => {
        updateMessage(destination, id, "SUCCESS");
      })
      .catch((err) => {
        console.error("ERROR sending message", err);
        updateMessage(destination, id, "FAILURE", String(err));
      });
  };

  const handleAddNewConversation = (counterparty: string) => {
    addNewConversation(counterparty);
    setFocus("chat");
  };

  // attach event listener for new messages
  useEffect(() => {
    if (!myPeerId || !socketRef.current) return;
    socketRef.current.addEventListener("message", handleReceivedMessage);

    return () => {
      if (!socketRef.current) return;
      socketRef.current.removeEventListener("message", handleReceivedMessage);
    };
  }, [myPeerId, socketRef.current]);

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
          status={status}
          counterparties={Array.from(conversations.keys())}
          selection={selection}
          setSelection={handleSetSelection}
          addNewConversation={handleAddNewConversation}
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
        <PersonalPanel
          myPeerId={myPeerId ?? "unknown"}
          settings={settings}
          updateSettings={updateSettings}
        />
        <Chat
          selection={selection}
          messages={conversation ? Array.from(conversation.values()) : []}
          sendMessage={handleSendMessage}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
