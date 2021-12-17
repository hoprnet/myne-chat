/*
  A react hook.
  Contains the app's global state.
*/
import { useImmer } from "use-immer";
import useWebsocket from "./websocket";
import useUser from "./user";
import { genId, getUrlParams, isSSR } from "../utils";

export type { ConnectionStatus } from "./websocket";

export type Message = {
  id: string;
  isIncoming: boolean;
  content: string;
  createdBy: string;
  createdAt: number;
  status: "UNKNOWN" | "SUCCESS" | "FAILURE";
  error?: string;
};

export type Settings = {
  httpEndpoint: string;
  wsEndpoint: string;
  securityToken?: string;
};

export type State = {
  settings: Settings;
  conversations: Map<string, Map<string, Message>>;
  selection?: string;
};

const useAppState = () => {
  const urlParams = !isSSR ? getUrlParams(location) : {};
  const [state, setState] = useImmer<State>({
    settings: {
      httpEndpoint: urlParams.httpEndpoint || "http://localhost:3001",
      wsEndpoint: urlParams.wsEndpoint || "ws://localhost:3000",
      securityToken: urlParams.securityToken,
    },
    conversations: new Map([]),
    /*
      16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs
      16Uiu2HAm83TSuRSCN8mKaZbCekkx3zfqgniPSxHdeUSeyEkdwvTs
    */
  });
  // initialize websocket connection & state tracking
  const websocket = useWebsocket(state.settings);
  // fetch user data
  const user = useUser(state.settings);

  const updateSettings = (settings: Partial<Settings>) => {
    setState((draft) => {
      for (const [k, v] of Object.entries(settings)) {
        (draft.settings as any)[k] = v;
      }
      return draft;
    });
  };

  const setSelection = (selection: string) => {
    setState((draft) => {
      draft.selection = selection;
      return draft;
    });
  };

  const addSentMessage = (
    myPeerId: string,
    destination: string,
    content: string
  ) => {
    const id = genId();
    setState((draft) => {
      const messages = draft.conversations.get(destination) || new Map();

      draft.conversations.set(
        destination,
        messages.set(id, {
          id,
          isIncoming: false,
          content: content,
          status: "UNKNOWN",
          createdBy: myPeerId,
          createdAt: +new Date(),
        })
      );

      return draft;
    });

    return id;
  };

  const addReceivedMessage = (from: string, content: string) => {
    setState((draft) => {
      const messages = draft.conversations.get(from) || new Map();
      const id = genId();

      draft.conversations.set(
        from,
        messages.set(id, {
          id: genId(),
          isIncoming: true,
          content: content,
          status: "SUCCESS",
          createdBy: from,
          createdAt: +new Date(),
        })
      );

      return draft;
    });
  };

  const updateMessage = (
    counterparty: string,
    messageId: string,
    status: Message["status"],
    error?: string
  ) => {
    setState((draft) => {
      const conversations = draft.conversations.get(counterparty);
      if (!conversations) return draft;
      const message = conversations.get(messageId);
      if (!message) return draft;

      message.status = status;
      message.error = error;

      conversations.set(messageId, message);
      return draft;
    });
  };

  const addNewConversation = (peerId: string) => {
    setState((draft) => {
      if (!draft.conversations.has(peerId)) {
        draft.conversations.set(peerId, new Map());
      }
      draft.selection = peerId;
      return draft;
    });
  };

  return {
    state: {
      ...state,
      ...websocket.state,
      ...user.state,
    },
    getReqHeaders: user.getReqHeaders,
    socketRef: websocket.socketRef,
    updateSettings,
    setSelection,
    addSentMessage,
    addReceivedMessage,
    updateMessage,
    addNewConversation,
  };
};

export default useAppState;
