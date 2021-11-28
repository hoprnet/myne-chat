import type { Immutable } from "immer";
import { useState, useEffect, useRef } from "react";
import produce, { enableMapSet } from "immer";
import { genId } from "./utils";
enableMapSet();

type PeerId = string;

export type Message = Immutable<{
  id: string;
  isIncoming: boolean;
  content: string;
  createdBy: PeerId;
  createdAt: number;
}>;

export const useWebsocket = (endpoint: string) => {
  const [state, setState] = useState<{
    connection: "CONNECTED" | "DISCONNECTED";
    endpoint: string;
  }>({ connection: "DISCONNECTED", endpoint });

  const socketRef = useRef<WebSocket>();

  // run once
  useEffect(() => {
    if (typeof WebSocket === "undefined") return;

    socketRef.current = new WebSocket(state.endpoint);

    // Connection opened
    socketRef.current.addEventListener("open", function () {
      setState(
        produce(state, (draft) => {
          draft.connection = "CONNECTED";
        })
      );
    });

    // Connection closed
    socketRef.current.addEventListener("close", function () {
      setState(
        produce(state, (draft) => {
          draft.connection = "DISCONNECTED";
        })
      );
    });
  }, []);

  return {
    state,
    socketRef,
  };
};

export const useAppState = () => {
  const [state, setState] = useState<{
    conversations: Map<PeerId, Set<Message>>;
    httpEndpoint: string;
    wsEndpoint: string;
    myPeerId?: PeerId;
    selectedCounterparty?: PeerId;
  }>({
    httpEndpoint: "http://localhost:8080",
    wsEndpoint: "ws://localhost:8081",
    conversations: new Map(),
    /*
      16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs
      16Uiu2HAm83TSuRSCN8mKaZbCekkx3zfqgniPSxHdeUSeyEkdwvTs
    */
  });

  const setSelectedCounterparty = (selectedCounterparty: string) => {
    setState(
      produce(state, (draft) => {
        draft.selectedCounterparty = selectedCounterparty;
        return draft;
      })
    );
  };

  const sendMessage = (destination: string, content: string) => {
    setState(
      produce(state, (draft) => {
        if (!draft.myPeerId) return;

        const messages = draft.conversations.get(destination) || new Set();

        draft.conversations.set(
          destination,
          messages.add({
            id: genId(),
            isIncoming: false,
            content: content,
            createdBy: draft.myPeerId,
            createdAt: +new Date(),
          })
        );

        return draft;
      })
    );
  };

  const receivedMessage = (from: string, content: string) => {
    setState(
      produce(state, (draft) => {
        const messages = draft.conversations.get(from) || new Set();

        draft.conversations.set(
          from,
          messages.add({
            id: genId(),
            isIncoming: true,
            content: content,
            createdBy: from,
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

  const fetchPeerId = async (): Promise<string> => {
    return fetch(`${state.httpEndpoint}/info`)
      .then((res) => res.json())
      .then((o) => o.peerId);
  };

  // run once
  useEffect(() => {
    if (typeof fetch === "undefined") return;

    const init = async () => {
      const peerId = await fetchPeerId();

      setState(
        produce(state, (draft) => {
          draft.myPeerId = peerId;
          return draft;
        })
      );
    };

    init();
  }, []);

  return {
    state,
    setSelectedCounterparty,
    sendMessage,
    receivedMessage,
    startNewConversation,
  };
};
