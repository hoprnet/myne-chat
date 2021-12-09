import type { NextPage } from "next";
import { useState, useContext, useEffect } from "react";
import { Box, Button, ResponsiveContext } from "grommet";
import { LinkPrevious } from "grommet-icons";
import useAppState from "../src/state";
import { encodeMessage, decodeMessage } from "../src/utils";
import ConversationsPanel from "../src/components/conversations-panel";
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
  const isMobile = screenSize === "small";

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

    const url = new URL(setting.httpEndpoint);
    const endpoint = `${url.protocol}//${url.host}${url.pathname}`;
    const headers = new Headers();
    if (url.username && url.username !== "") {
      headers.set(
        "Authorization",
        "Basic " + btoa(`${url.username}:${url.password}`)
      );
    }

    fetch(`${endpoint}api/v2/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        recipient: selection,
        body: encodedMessage,
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
          setSelection={handleSetSelection}
          addNewConversation={handleAddNewConversation}
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
          selection={selection}
          messages={conversation ? Array.from(conversation.values()) : []}
          sendMessage={handleSendMessage}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
