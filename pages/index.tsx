import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { Box, Button, ResponsiveContext } from "grommet";
import { LinkPrevious } from "grommet-icons";

import useAppState from "../src/state";
import ConversationsPanel from "../src/components/conversations-panel";
import Chat from "../src/components/chat";


const HomePage: NextPage = () => {
  const {
    state: { selection, conversations, myPeerId, settings, status, verified },
    socketRef,
    setSelection,
    setVerified,
    updateSettings,
    handleAddNewConversation,
    handleSendMessage,
    handleReceivedMessage,
    loadDevHelperConversation,
  } = useAppState();

  // get selected conversation
  const conversation = selection ? conversations.get(selection) : undefined;

  const { query } = useRouter();
  const { development } = query;

  // currently focused element (used in mobile mode)
  const [focus, setFocus] = useState<"conversations-panel" | "chat">(
    "conversations-panel"
  );
  const screenSize = useContext(ResponsiveContext);
  const isMobile = screenSize === "small";
  
  // attach event listener for new messages
  useEffect(() => {
    if (!myPeerId || !socketRef.current) return;
    socketRef.current.addEventListener("message", handleReceivedMessage);

    return () => {
      if (!socketRef.current) return;
      socketRef.current.removeEventListener("message", handleReceivedMessage);
    };
  }, [myPeerId, socketRef.current]);

  // Adding Dev helper conversation to showcase components.
  useEffect(() => {
    (development == 'enabled' || process.env.NODE_ENV != 'production') && loadDevHelperConversation();
  }, [development])

  return (
    <Box fill direction="row" justify="between" pad="small">
      <Box
        fill={isMobile ? true : "vertical"}
        flex={{ shrink: 1, grow: 1 }}
        basis="0%"
        pad={{ right: isMobile ? undefined : "small" }}
        style={{
          display:
            isMobile && focus !== "conversations-panel" ? "none" : undefined,
        }}
      >
        <ConversationsPanel
          status={status}
          myPeerId={myPeerId}
          settings={settings}
          updateSettings={updateSettings}
          selection={selection}
          setSelection={(counterparty: string) => {
            setSelection(counterparty);
            setFocus("chat");
          }}
          addNewConversation={handleAddNewConversation(() => setFocus("chat"))}
          counterparties={Array.from(conversations.keys())}
        />
      </Box>
      <Box
        fill={isMobile ? true : "vertical"}
        flex={{ shrink: 6, grow: 6 }}
        basis="0%"
        direction="column"
        justify="between"
        style={{
          display: isMobile && focus !== "chat" ? "none" : undefined,
        }}
        gap="small"
      >
        {isMobile ? (
          <Button
            icon={<LinkPrevious />}
            onClick={() => setFocus("conversations-panel")}
          />
        ) : null}
        <Chat
          setVerified={setVerified}
          verified={verified}
          selection={selection}
          messages={conversation ? Array.from(conversation.values()) : []}
          sendMessage={handleSendMessage}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
