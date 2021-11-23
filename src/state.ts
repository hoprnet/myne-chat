import type { Immutable } from "immer";
import { useState, useEffect } from "react";
import produce, { enableMapSet } from "immer";
enableMapSet();

type PeerId = string;

export type Message = Immutable<{
  id: string;
  isIncoming: boolean;
  content: string;
  createdBy: PeerId;
  createdAt: number;
}>;

export type State = {
  myPeerId?: PeerId;
  selectedCounterparty?: PeerId;
  conversations: Map<PeerId, Set<Message>>;
};

const useGlobalState = (initialState: State) => {
  // set state to a mocked state
  const setToMockState = () => {
    const SELF = "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRthk4rF1rbY-self";
    const COUNTERPARTY_A =
      "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRt-counterpartyA";
    const COUNTERPARTY_B =
      "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRt-counterpartyB";

    // cloning object as it breaks react? jesus..
    const conversations: Map<string, Set<Message>> = new Map([
      [
        COUNTERPARTY_A,
        new Set([
          {
            id: "1",
            createdBy: COUNTERPARTY_A,
            createdAt: +new Date("01/01/2021"),
            content: "hello world from A",
            isIncoming: true,
          },
          {
            id: "2",
            createdBy: SELF,
            createdAt: +new Date("01/02/2021"),
            content: "hello back A",
            isIncoming: false,
          },
        ]),
      ],
      [
        COUNTERPARTY_B,
        new Set([
          {
            id: "1",
            createdBy: COUNTERPARTY_B,
            createdAt: +new Date("01/01/2021"),
            content: "hello world from B",
            isIncoming: true,
          },
          {
            id: "2",
            createdBy: SELF,
            createdAt: +new Date("01/02/2021"),
            content: "hello back B",
            isIncoming: false,
          },
        ]),
      ],
    ]);

    setState(
      produce(state, (draft) => {
        draft.conversations = conversations;
        draft.myPeerId = SELF;
        draft.selectedCounterparty = COUNTERPARTY_A;
      })
    );
  };

  const setSelectedCounterparty = (selectedCounterparty: string) => {
    setState(
      produce(state, (draft) => {
        draft.selectedCounterparty = selectedCounterparty;
        return draft;
      })
    );
  };

  const addMessage = (
    counterparty: string,
    data: Pick<Message, "isIncoming" | "content" | "createdBy">
  ) => {
    setState(
      produce(state, (draft) => {
        const messages = draft.conversations.get(counterparty) || new Set();

        draft.conversations.set(
          counterparty,
          messages.add({
            id: String(messages.size),
            isIncoming: data.isIncoming,
            content: data.content,
            createdBy: data.createdBy,
            createdAt: +new Date(),
          })
        );

        return draft;
      })
    );
  };

  const startNewConversation = (counterparty: string) => {
    setState(
      produce(state, (draft) => {
        if (!draft.conversations.has(counterparty)) {
          draft.conversations.set(counterparty, new Set());
        }
        draft.selectedCounterparty = counterparty;
        return draft;
      })
    );
  };

  const [state, setState] = useState<State>(initialState);

  // add mocked state
  useEffect(() => setToMockState(), []);

  return {
    state,
    setToMockState,
    setSelectedCounterparty,
    addMessage,
    startNewConversation,
  };
};

export default useGlobalState;
