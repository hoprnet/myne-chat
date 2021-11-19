import type { NextPage } from "next";
import { useState, useContext, useCallback } from "react";
import { Box, Button, ResponsiveContext } from "grommet";
import produce from "immer";
import { State, updateToMockState } from "../src/state";
import Statistics from "../src/components/statistics";
import Chat from "../src/components/chat";

const HomePage: NextPage = () => {
  const [state, setState] = useState<State>(updateToMockState());
  const conversations = Array.from(state.conversations.values());
  const conversation = state.selectedConversation
    ? state.conversations.get(state.selectedConversation)
    : undefined;

  const [focus, setFocus] = useState<"statistics" | "chat">("statistics");
  const isSmall = useContext(ResponsiveContext) === "small";
  const showStatsOnly = isSmall && focus === "statistics";
  const showChatOnly = isSmall && focus === "chat";

  const handleSelect = useCallback((selected) => {
    setState(
      produce((draft) => {
        draft.selectedConversation = selected;
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

  return (
    <Box fill direction="row" justify="between" pad="small">
      <Box
        width={isSmall ? "100%" : "250px"}
        pad={{ right: isSmall ? undefined : "small" }}
        style={{
          display: showChatOnly ? "none" : undefined,
        }}
      >
        <Statistics
          conversations={conversations}
          selected={conversation}
          onSelect={handleSelect}
        />
      </Box>
      <Box
        width="100%"
        height="100%"
        direction="column"
        justify="between"
        style={{
          display: showStatsOnly ? "none" : undefined,
        }}
      >
        {isSmall ? (
          <Button label="<-" onClick={() => setFocus("statistics")} />
        ) : null}
        <Chat conversation={conversation} onSend={handleSend} />
      </Box>
    </Box>
  );
};

export default HomePage;
