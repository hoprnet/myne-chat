/*
  A react hook.
  Contains the app's global state.
*/
import { useImmer } from "use-immer";
import useWebsocket from "./websocket";
import useUser from "./user";
import { decodeMessage, encodeMessage, genId, getUrlParams, isSSR, verifySignatureFromPeerId } from "../utils";
import { API } from "../lib/api";

const MYNE_CHAT_GIT_HASH = process.env.NEXT_PUBLIC_MYNE_CHAT_GIT_HASH
const MYNE_CHAT_VERSION = require('../../package.json').version
const MYNE_CHAT_ENVIRONMENT = process.env.NEXT_PUBLIC_MYNE_CHAT_ENVIRONMENT

export type { ConnectionStatus } from "./websocket";

export type VerifiedStatus = "UNVERIFIED" | "VERIFIED" | "FAILED_VERIFICATION"

export type UpdateMessageHandlerInterface = (counterparty: string, messageId: string, status: Message["status"], error?: string | undefined) => void

export type Message = {
  id: string;
  isIncoming: boolean;
  content: string;
  createdBy: string;
  createdAt: number;
  status: "UNKNOWN" | "SUCCESS" | "FAILURE";
  error?: string;
  verifiedStatus?: VerifiedStatus;
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
  verified: boolean;
};

const useAppState = () => {
  const urlParams = !isSSR ? getUrlParams(location) : {};
  const [state, setState] = useImmer<State>({
    settings: {
      httpEndpoint: urlParams.httpEndpoint || "http://localhost:3001",
      wsEndpoint: urlParams.wsEndpoint || "ws://localhost:3000",
      securityToken: urlParams.securityToken,
    },
    verified: false,
    conversations: new Map([]),
    /*
      16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs
      16Uiu2HAm83TSuRSCN8mKaZbCekkx3zfqgniPSxHdeUSeyEkdwvTs
    */
  });
  // initialize websocket connection & state tracking
  const websocket = useWebsocket(state.settings);
  // fetch user data
  const user = useUser(API)(state.settings);

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

  const setVerified = (verified: boolean) => {
    setState(draft => {
      draft.verified = verified;
      return draft;
    })
  }

  const addSentMessage = (
    myPeerId: string,
    destination: string,
    content: string,
    verifiedStatus?: VerifiedStatus
  ) => {
    const id = genId();
    setState((draft) => {
      const messages = draft.conversations.get(destination) || new Map<string, Message>();

      draft.conversations.set(
        destination,
        messages.set(id, {
          id,
          isIncoming: false,
          content: content,
          status: "UNKNOWN",
          createdBy: myPeerId,
          createdAt: +new Date(),
          verifiedStatus,
        })
      );

      return draft;
    });

    return id;
  };

  const addReceivedMessage = (from: string, content: string, verifiedStatus?: VerifiedStatus) => {
    setState((draft) => {
      const messages = draft.conversations.get(from) || new Map<string, Message>();
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
          verifiedStatus
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
        draft.conversations.set(peerId, new Map<string, Message>());
      }
      draft.selection = peerId;
      return draft;
    });
  };

  const handleAddNewConversation = (callback: () => void) => (counterparty: string) => {
    addNewConversation(counterparty);
    callback();
  };

  const handleSendMessage = async (destination: string, message: string) => {
    const { selection, settings, verified } = state;
    const { myPeerId } = user?.state;
    const { socketRef } = websocket;
    if (!myPeerId || !selection || !socketRef.current) return;

    const headers = user.getReqHeaders(true)
    const api = API(settings.httpEndpoint, headers)
    const signature = verified && await api.signRequest(message)
      .catch((err: any) => console.error('ERROR Failed to obtain signature', err));
    const encodedMessage = encodeMessage(myPeerId, message, signature);
    const id = addSentMessage(myPeerId, destination, message);

    await api.sendMessage(selection, encodedMessage, destination, id, updateMessage)
      .catch((err: any) => console.error('ERROR Failed to send message', err));
  };

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

  const loadDevHelperConversation = () => {
    console.log("⚙️  Developer Mode enabled.", process.env.NODE_ENV)
    const dev = '⚙️  Dev'
    addNewConversation(dev)
    // setTimeout ensures the event loop takes these state updates in order.
    setTimeout(() => addReceivedMessage(dev, 'Welcome to the developer mode.'), 0)
    setTimeout(() => addReceivedMessage(dev, 'This conversation is only available during development.'), 0)
    setTimeout(() => addReceivedMessage(dev, 'This is how a verified message looks like.', 'VERIFIED'), 0)
    setTimeout(() => addReceivedMessage(dev, 'This is how an unverified message looks like.', 'UNVERIFIED'), 0)
    setTimeout(() => addReceivedMessage(dev, 'This is how a failed verification message looks like.', 'FAILED_VERIFICATION'), 0)
  }

  return {
    state: {
      ...state,
      ...websocket.state,
      ...user.state,
    },
    socketRef: websocket.socketRef,
    updateSettings,
    setSelection,
    setVerified,
    handleAddNewConversation,
    handleSendMessage,
    handleReceivedMessage,
    loadDevHelperConversation,
    hash: MYNE_CHAT_GIT_HASH,
    version: MYNE_CHAT_VERSION,
    environment: MYNE_CHAT_ENVIRONMENT
  };
};

export default useAppState;
