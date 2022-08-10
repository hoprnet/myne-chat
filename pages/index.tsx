import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { Box, Button, ResponsiveContext } from "grommet";
import { LinkPrevious } from "grommet-icons";

import useAppState from "../src/state";
import ConversationsPanel from "../src/components/conversations-panel";
import Chat from "../src/components/chat";
import useWebsocket from "../src/state/websocket";
import useUser from "../src/state/user";
import { useBalanceListener } from "../src/state/coins";

const HomePage: NextPage = () => {
  const {
    state: { selection, conversations, settings, verified },
    addReceivedMessage,
    addSentMessage,
    setSelection,
    setVerified,
    updateSettings,
    handleAddNewConversation,
    handleSendMessage,
    handleReceivedMessage,
    loadDevHelperConversation,
    loadWelcomeConversation,
  } = useAppState();
  // initialize websocket connection & state tracking
  const websocket = useWebsocket(settings);
  const { socketRef } = websocket;
  const { status } = websocket?.state;
  // fetch user data
  const user = useUser(settings);
  const { getReqHeaders } = user;
  const { hoprBalance } = useBalanceListener(settings, getReqHeaders(false));
  const { myPeerId } = user?.state;

  // get selected conversation
  const conversation = selection ? conversations.get(selection) : undefined;

  const query = useRouter()?.query;
  const development = query?.development;

  // currently focused element (used in mobile mode)
  const [focus, setFocus] = useState<"conversations-panel" | "chat">(
    "conversations-panel"
  );
  const screenSize = useContext(ResponsiveContext);
  const isMobile = screenSize === "small";

  // attach event listener for new messages
  useEffect(() => {
    if (!myPeerId || !socketRef.current) return;
    socketRef.current.addEventListener(
      "message",
      handleReceivedMessage(addReceivedMessage)
    );

    return () => {
      if (!socketRef.current) return;
      socketRef.current.removeEventListener(
        "message",
        handleReceivedMessage(addReceivedMessage)
      );
    };
  }, [myPeerId, socketRef.current]);

  // Adding Dev helper conversation to showcase components.
  useEffect(() => {
    loadWelcomeConversation();
    //(development == 'enabled' || process.env.NODE_ENV != 'production') && loadDevHelperConversation();
  }, [development]);

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
          headers={getReqHeaders(false)}
          settings={settings}
          updateSettings={updateSettings}
          selection={selection}
          setSelection={(counterparty: string) => {
            setSelection(counterparty);
            setFocus("chat");
          }}
          addNewConversation={handleAddNewConversation(() => setFocus("chat"))}
          counterparties={Array.from(conversations.keys())}
          hoprBalance={hoprBalance}
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
          apiEndpoint={settings.apiEndpoint}
          messages={conversation ? Array.from(conversation.values()) : []}
          sendMessage={handleSendMessage(addSentMessage)(
            myPeerId,
            socketRef,
            getReqHeaders(true)
          )}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
