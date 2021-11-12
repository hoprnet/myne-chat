import produce, { enableMapSet } from "immer";
enableMapSet();

export type Message = {
  id: string;
  from: string;
  direction: "sent" | "received";
  time: number;
  content: string;
};

export type Conversation = {
  with: string;
  messages: Set<Message>;
};

export type State = {
  peerId?: string;
  conversations: Map<string, Conversation>;
  selectedConversation?: string;
};

export const baseState: State = {
  conversations: new Map(),
};

// update state to a mocked state
export const updateToMockState = () => {
  const SELF = "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRthk4rF1rbY-self";
  const COUNTERPARTY_A =
    "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRt-counterpartyA";
  const COUNTERPARTY_B =
    "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRt-counterpartyB";

  // cloning object as it breaks react? jesus..
  const conversations: Map<string, Conversation> = new Map([
    [
      COUNTERPARTY_A,
      {
        with: COUNTERPARTY_A,
        messages: new Set([
          {
            id: "1",
            from: COUNTERPARTY_A,
            time: +new Date("01/01/2021"),
            content: "hello world from A",
            direction: "received" as Message["direction"],
          },
          {
            id: "2",
            from: SELF,
            time: +new Date("01/02/2021"),
            content: "hello back A",
            direction: "sent" as Message["direction"],
          },
        ]),
      },
    ],
    [
      COUNTERPARTY_B,
      {
        with: COUNTERPARTY_B,
        messages: new Set([
          {
            id: "1",
            from: COUNTERPARTY_B,
            time: +new Date("01/01/2021"),
            content: "hello world from B",
            direction: "received" as Message["direction"],
          },
          {
            id: "2",
            from: SELF,
            time: +new Date("01/02/2021"),
            content: "hello back B",
            direction: "sent" as Message["direction"],
          },
        ]),
      },
    ],
  ]);

  return produce(baseState, (draft) => {
    draft.peerId = SELF;
    draft.conversations = conversations;
    draft.selectedConversation = COUNTERPARTY_A;
  });
};
