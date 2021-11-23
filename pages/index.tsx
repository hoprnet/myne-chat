import type { NextPage } from "next";
import { useState, useContext, useEffect } from "react";
import { Box, Button, ResponsiveContext } from "grommet";
import { LinkPrevious } from "grommet-icons";
import useGlobalState from "../src/state";
import ConversationsPanel from "../src/components/conversations-panel";
import PersonalPanel from "../src/components/personal-panel";
import Chat from "../src/components/chat";

const HomePage: NextPage = () => {
  const { state, setSelectedCounterparty, addMessage, startNewConversation } =
    useGlobalState({
      conversations: new Map(),
    });

  const conversation = state.selectedCounterparty
    ? state.conversations.get(state.selectedCounterparty)
    : undefined;
  const [focus, setFocus] = useState<"conversations-panel" | "chat">(
    "conversations-panel"
  );
  const isSmall = useContext(ResponsiveContext) === "small";
  const showConvsOnly = isSmall && focus === "conversations-panel";
  const showChatOnly = isSmall && focus === "chat";

  const handleSelect = (selectedCounterparty: string) => {
    setSelectedCounterparty(selectedCounterparty);
    setFocus("chat");
  };

  const handleSend = async (content: string) => {
    const sendMessage = async () => Promise.resolve();

    sendMessage().then(() => {
      if (!state.myPeerId || !state.selectedCounterparty) return;

      addMessage(state.selectedCounterparty, {
        isIncoming: false,
        content,
        createdBy: state.myPeerId,
      });
    });
  };

  const handleNewConversation = (newCounterparty: string) => {
    startNewConversation(newCounterparty);
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
          counterparties={Array.from(state.conversations.keys())}
          selectedCounterparty={state.selectedCounterparty}
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
        <PersonalPanel myPeerId={state.myPeerId ?? "unknown"} />
        <Chat
          messages={conversation ? Array.from(conversation.values()) : []}
          onSend={handleSend}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
