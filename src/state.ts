import type { Immutable } from "immer";
import produce, { enableMapSet } from "immer";
enableMapSet();
import { useState, useEffect, useRef } from "react";
import { genId } from "./utils";

export type Message = Immutable<{
  id: string;
  isIncoming: boolean;
  content: string;
  createdBy: string;
  createdAt: number;
}>;

/*
  Handle websocket connection and track its state.
*/
export const useWebsocketState = (endpoint: string) => {
  const [state, setState] = useState<{
    status: "CONNECTED" | "DISCONNECTED";
    endpoint: string;
    error?: string;
  }>({ status: "DISCONNECTED", endpoint });

  const socketRef = useRef<WebSocket>();

  const setEndpoint = (v: string) => {
    setState((s) =>
      produce(s, (draft) => {
        draft.endpoint = v;
      })
    );
  };

  // runs everytime "endpoint" changes
  useEffect(() => {
    if (typeof WebSocket === "undefined") return;

    // disconnect from previous connection
    if (socketRef.current) {
      socketRef.current.close(1000, "Shutting down");
    }

    socketRef.current = new WebSocket(state.endpoint);

    // handle connection opening
    socketRef.current.addEventListener("open", () => {
      console.info("WS CONNECTED");
      setState((s) =>
        produce(s, (draft) => {
          draft.status = "CONNECTED";
        })
      );
    });

    // handle connection closing
    socketRef.current.addEventListener("close", () => {
      console.info("WS DISCONNECTED");
      setState((s) =>
        produce(s, (draft) => {
          draft.status = "DISCONNECTED";
        })
      );
    });

    // handle errors
    socketRef.current.addEventListener("error", (e) => {
      console.error(e);
      setState((s) =>
        produce(s, (draft) => {
          draft.error = String(e);
        })
      );
    });
  }, [endpoint]);

  return {
    state,
    socketRef,
    setEndpoint,
  };
};

/*
  Keep user state updated.
*/
export const useUserState = (endpoint: string) => {
  const [state, setState] = useState<{
    endpoint: string;
    myPeerId?: string;
    error?: string;
  }>({
    endpoint,
  });

  const fetchInfo = async (): Promise<string> => {
    return fetch(`${state.endpoint}/info`)
      .then((res) => res.json())
      .then((o) => o.peerId);
  };

  const setEndpoint = (v: string) => {
    setState((s) =>
      produce(s, (draft) => {
        draft.endpoint = v;
      })
    );
  };

  // runs everytime "endpoint" changes
  useEffect(() => {
    if (typeof fetch === "undefined") return;

    fetchInfo()
      .then((peerId) => {
        console.info("Fetched PeerId", peerId);
        setState((s) =>
          produce(s, (draft) => {
            draft.myPeerId = peerId;
            return draft;
          })
        );
      })
      .catch((err) => {
        console.error(err);
        setState((s) =>
          produce(s, (draft) => {
            draft.error = err;
            return draft;
          })
        );
      });
  }, [endpoint]);

  return {
    state,
    setEndpoint,
  };
};

export const useAppState = () => {
  const [state, setState] = useState<{
    httpEndpoint: string;
    wsEndpoint: string;
    conversations: Map<string, Set<Message>>;
    selection?: string;
  }>({
    httpEndpoint: "http://localhost:8080",
    wsEndpoint: "ws://localhost:8081",
    conversations: new Map([
[      "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs", new Set<any>(),
],[      "16Uiu2HAm83TSuRSCN8mKaZbCekkx3zfqgniPSxHdeUSeyEkdwvTs", new Set<any>(),
]    ]),
    /*
      16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs
      16Uiu2HAm83TSuRSCN8mKaZbCekkx3zfqgniPSxHdeUSeyEkdwvTs
    */
  });
  const websocket = useWebsocketState(state.wsEndpoint);
  const user = useUserState(state.httpEndpoint);

  useEffect(() => {
    websocket.setEndpoint(state.wsEndpoint);
  }, [state.wsEndpoint]);
  useEffect(() => {
    user.setEndpoint(state.httpEndpoint);
  }, [state.httpEndpoint]);

  const updateSettings = (settings: {
    httpEndpoint?: string;
    wsEndpoint?: string;
  }) => {
    setState((s) =>
      produce(s, (draft) => {
        if (settings.httpEndpoint) draft.httpEndpoint = settings.httpEndpoint;
        else if (settings.wsEndpoint) draft.wsEndpoint = settings.wsEndpoint;
        return draft;
      })
    );
  };

  const setSelection = (selection: string) => {
    setState((s) =>
      produce(s, (draft) => {
        draft.selection = selection;
        return draft;
      })
    );
  };

  const sentMessage = (
    myPeerId: string,
    destination: string,
    content: string
  ) => {
    setState((s) =>
      produce(s, (draft) => {
        const messages = draft.conversations.get(destination) || new Set();

        draft.conversations.set(
          destination,
          messages.add({
            id: genId(),
            isIncoming: false,
            content: content,
            createdBy: myPeerId,
            createdAt: +new Date(),
          })
        );

        return draft;
      })
    );
  };

  const receivedMessage = (from: string, content: string) => {
    setState((s) =>
      produce(s, (draft) => {
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

  const newConversation = (peerId: string) => {
    setState((s) =>
      produce(s, (draft) => {
        if (!draft.conversations.has(peerId)) {
          draft.conversations.set(peerId, new Set());
        }
        draft.selection = peerId;
        return draft;
      })
    );
  };

  return {
    state: {
      ...state,
      ...websocket.state,
      ...user.state,
    },
    socketRef: websocket.socketRef,
    updateSettings,
    setSelection,
    sentMessage,
    receivedMessage,
    newConversation,
  };
};
