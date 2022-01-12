import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { Box, Button, ResponsiveContext } from "grommet";
import { LinkPrevious } from "grommet-icons";
import useAppState, { Message, VerifiedStatus } from "../src/state";
import { encodeMessage, decodeMessage, verifySignatureFromPeerId, genId } from "../src/utils";
import ConversationsPanel from "../src/components/conversations-panel";
import Chat from "../src/components/chat";
import { API } from "../src/lib/api";
import { useConversations } from "../src/state/conversations";

const HomePage: NextPage = () => {
  const {
    state: { myPeerId, settings, status, verified },
    getReqHeaders,
    socketRef,
    updateSettings,
  } = useAppState();

  const [ state, dispatch ] = useConversations();
  const { conversations, selection } = state;

  // @TODO: Move these functions to a more suitable place.
  const addReceivedMessage = (peerId: string, message: string, verifiedStatus?: VerifiedStatus) => dispatch({
    type: 'ADD_RECEIVED_MESSAGE',
    from: peerId,
    content: message,
    verifiedStatus
  })
  const addSentMessage = (myPeerId: string, destination: string, message: string, id: string) => dispatch({
    type: 'ADD_SENT_MESSAGE', myPeerId, destination, content: message, id
  })
  const updateMessage = (counterparty: string, messageId: string, status: Message["status"], error?: string) => dispatch({
    type: 'UPDATE_MESSAGE',
    counterparty,
    messageId,
    status,
    error
  })
  const addNewConversation = (peerId: string) => dispatch({
    type: 'ADD_NEW_CONVERSATION',
    peerId
  })
  const setSelection = (peerId: string) => dispatch({ type: 'SET_SELECTION', selection: peerId });

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

  const handleReceivedMessage = async (ev: MessageEvent<string>) => {
    try {
      // we are only interested in messages, not all the other events coming in on the socket
      const data = JSON.parse(ev.data);
      if (data.type == "message") {
        const { tag, from, message, signature } = decodeMessage(data.msg);

        const verifiedStatus : VerifiedStatus = signature ? 
          (await verifySignatureFromPeerId(from, message, signature) ? 
            "VERIFIED" :
            "FAILED_VERIFICATION"
          ) :
          "UNVERIFIED";

        // we are only interested in myne messages
        if (tag == "myne") {
          addReceivedMessage(from, message, verifiedStatus);
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

  const handleSendMessage = async (destination: string, message: string) => {
    if (!myPeerId || !selection || !socketRef.current) return;

    const headers = getReqHeaders(true)
    const api = API(settings.httpEndpoint, headers)

    const signature = verified && await api.signRequest(message)
      .catch(err => console.error('ERROR Failed to obtain signature', err));

    const encodedMessage = encodeMessage(myPeerId, message, signature);
    const id = genId();
    addSentMessage(myPeerId, destination, message, id);

    await api.sendMessage(selection, encodedMessage, id, destination, updateMessage)
      .catch(err => console.error('ERROR Failed to send message', err));
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
      dispatch({ type: 'ADD_NEW_CONVERSATION', peerId: dev })
      // setTimeout ensures the event loop takes these state updates in order.
      setTimeout(() => addReceivedMessage(dev, 'Welcome to the developer mode.'), 0)
      setTimeout(() => addSentMessage(myPeerId || '', dev, 'This conversation is only available during development.', genId()), 0)
      setTimeout(() => addReceivedMessage(dev, 'This is how a verified message looks like.', 'VERIFIED'), 0)
      setTimeout(() => addReceivedMessage(dev, 'This is how an unverified message looks like.', 'UNVERIFIED'), 0)
      setTimeout(() => addReceivedMessage(dev, 'This is how a failed verification message looks like.', 'FAILED_VERIFICATION'), 0)
    }
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
