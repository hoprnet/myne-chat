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
    getReqHeaders,
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
      // we are only interested in messages, not all the other events coming in on the socket
      const data = JSON.parse(ev.data);
      if (data.type == "message") {
        const { tag, from, message } = decodeMessage(data.msg);
        // we are only interested in myne messages
        if (tag == "myne") {
          addReceivedMessage(from, message);
        }
      }
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

    fetch(`${settings.httpEndpoint}/api/v2/messages`, {
      method: "POST",
      headers: getReqHeaders(true),
      body: JSON.stringify({
        recipient: selection,
        body: encodedMessage,
      }),
    })
      .then(async (res) => {
        if (res.status === 204) return updateMessage(destination, id, "SUCCESS");
        if (res.status === 422) return updateMessage(destination, id, "FAILURE", (await res.json()).error)
        // If we didn't get a supported status response code, we return unknown
        const err = 'Unknown response status.'
        console.error("ERROR sending message", err);
        return updateMessage(destination, id, "UNKNOWN", err)
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

  // Adding Dev helper conversation to showcase components.
  useEffect(() => {
    const loadDevHelperConversation = () => {
      console.log("⚙️  Developer Mode enabled.", process.env.NODE_ENV)
      const dev = '⚙️  Dev'
      addNewConversation(dev)
      // setTimeout ensures the event loop takes these state updates in order.
      setTimeout(() => addReceivedMessage(dev, 'Welcome to the developer mode.'), 0)
      setTimeout(() => addReceivedMessage(dev, 'This conversation is only available during development.'), 0)
      setTimeout(() => addReceivedMessage(dev, 'This is how a verified message looks like.', true), 0)
    }
    process.env.NODE_ENV != 'production' && loadDevHelperConversation();
  }, [])

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
