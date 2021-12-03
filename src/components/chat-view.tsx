import type { FunctionComponent } from "react";
import type { Message } from "../state";
import { useEffect, useRef, useState } from "react";
import { Box, Text, InfiniteScroll } from "grommet";
import { debounce } from "lodash";
import ChatBubble from "./chat-bubble";

const ChatView: FunctionComponent<{
  messages: Message[];
}> = ({ messages }) => {
  // sorted in ASC by createdAt
  const sorted = messages.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  // whether the scroll should stay at the bottom when new messages are inserted
  const [scrollToBottom, setScrollToBottom] = useState<boolean>(true);
  const container = useRef<HTMLDivElement>(null);

  const setScrollToBottomDebounced = debounce<(ev: Event) => void>(() => {
    if (!container.current) return;

    const isAtBottom = container.current.scrollTop === 1;
    setScrollToBottom(isAtBottom);
  }, 250);

  // run once container is attached, keeps track of scroll
  useEffect(() => {
    if (!container.current) return;
    container.current.addEventListener("scroll", setScrollToBottomDebounced);

    return () => {
      if (!container.current) return;
      container.current.removeEventListener(
        "scroll",
        setScrollToBottomDebounced
      );
    };
  }, [container.current]);

  // scroll into view when a new message is inserted
  useEffect(() => {
    // do nothing if we have no container or no messages
    if (!container.current || sorted.length === 0) return;

    // we don't need to scroll to bottom
    if (!scrollToBottom) return;

    const latestElement = container.current.firstElementChild;
    if (!latestElement) return;

    // right now we scroll at all times since we don't
    // have a new message indicator
    // const message = sorted[sorted.length - 1];
    // if (message.isIncoming) return;

    latestElement.scrollIntoView();
  }, [container.current, sorted.length]);

  return (
    <Box
      height="100%"
      direction="column-reverse"
      overflow={{
        vertical: "auto",
        horizontal: "hidden",
      }}
      ref={container}
    >
      {messages.length > 0 ? (
        <InfiniteScroll items={sorted}>
          {(message: Message, _index: number, ref: any) => (
            <Box
              ref={ref}
              key={message.id}
              alignSelf={message.isIncoming ? "start" : "end"}
              flex={false}
              pad={{
                bottom: "large",
                right: "small",
              }}
            >
              <ChatBubble message={message} />
            </Box>
          )}
        </InfiniteScroll>
      ) : (
        <Box justify="center" height="100%">
          <Text textAlign="center" color="light-2">
            No messages, say hi!
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ChatView;
