import type { NextPage } from "next";
import { useState, useContext, useCallback } from "react";
import { Box, Button, ResponsiveContext } from "grommet";
import { LinkPrevious } from "grommet-icons";
import produce from "immer";
import { State, updateToMockState } from "../src/state";
import ConversationsPanel from "../src/components/conversations-panel";
import PersonalPanel from "../src/components/personal-panel";
import Chat from "../src/components/chat";

const HomePage: NextPage = () => {
  const [state, setState] = useState<State>(updateToMockState());
  const conversations = Array.from(state.conversations.values());
  const conversation = state.selectedConversation
    ? state.conversations.get(state.selectedConversation)
    : undefined;

  const [focus, setFocus] = useState<"conversations-panel" | "chat">(
    "conversations-panel"
  );
  const isSmall = useContext(ResponsiveContext) === "small";
  const showConvsOnly = isSmall && focus === "conversations-panel";
  const showChatOnly = isSmall && focus === "chat";

  const handleSelect = useCallback((selectedPeerId) => {
    setState(
      produce((draft) => {
        draft.selectedConversation = selectedPeerId;
        return draft;
      })
    );
    setFocus("chat");
  }, []);

  const handleSend = useCallback(async (content) => {
    const sendMessage = async () => Promise.resolve();

    sendMessage().then(() => {
      setState(
        produce((draft) => {
          if (!draft.selectedConversation) return;
          const conv = draft.conversations.get(draft.selectedConversation);
          if (!conv) return;

          conv.messages.add({
            id: String(conv.messages.size),
            from: draft.peerId || "",
            direction: "sent",
            time: +new Date(),
            content,
          });

          return draft;
        })
      );
    });
  }, []);

  const handleNewConversation = useCallback((peerId) => {
    setState(
      produce((draft) => {
        draft.selectedConversation = peerId;
        draft.conversations.set(peerId, {
          with: peerId,
          messages: new Set(),
        });
        return draft;
      })
    );
    setFocus("chat");
  }, []);

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
          conversations={conversations}
          selected={conversation}
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
        <PersonalPanel peerId={state.peerId ?? "unknown"} />
        <Chat conversation={conversation} onSend={handleSend} />
      </Box>
    </Box>
  );
};

export default HomePage;
