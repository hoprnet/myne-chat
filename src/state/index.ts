/*
  A react hook.
  Contains the app's global state.
*/
import { useImmer } from "use-immer";
import { decodeMessage, encodeMessage, genId, getUrlParams, isSSR, verifySignatureFromPeerId } from "../utils";
import { MutableRefObject } from "react";
import { sendMessage, signRequest } from "../lib/api";

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
  hasHTML?: boolean;
};

export type Settings = {
  httpEndpoint: string;
  wsEndpoint: string;
  securityToken?: string;
};

export const DEFAULT_SETTINGS: Settings = {
  httpEndpoint: "http://localhost:3001",
  wsEndpoint: "ws://localhost:3000"
}

export type State = {
  settings: Settings;
  conversations: Map<string, Map<string, Message>>;
  selection?: string;
  verified: boolean;
};

export type AddSentMessageHandler = (
  myPeerId: string,
  destination: string,
  content: string,
  id: string,
  verifiedStatus?: VerifiedStatus
) => void;

export type ReceiveMessageHandler = (from: string, content: string, verifiedStatus?: VerifiedStatus) => void

export const dev = 'Dev';
export const welcome = 'Welcome';
export const bots = [dev, welcome];

const useAppState = () => {
  const urlParams = !isSSR ? getUrlParams(location) : {};
  const [state, setState] = useImmer<State>({
    settings: {
      httpEndpoint: urlParams.httpEndpoint || DEFAULT_SETTINGS.httpEndpoint,
      wsEndpoint: urlParams.wsEndpoint || DEFAULT_SETTINGS.wsEndpoint,
      securityToken: urlParams.securityToken,
    },
    verified: false,
    conversations: new Map([]),
    /*
      16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs
      16Uiu2HAm83TSuRSCN8mKaZbCekkx3zfqgniPSxHdeUSeyEkdwvTs
    */
  });

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
    id: string,
    verifiedStatus?: VerifiedStatus
  ) => {
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
  };

  const addReceivedMessage = (from: string, content: string, verifiedStatus?: VerifiedStatus, hasHTML = false) => {
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
          verifiedStatus,
          hasHTML
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

  const handleSendMessage = (addSentMessage: AddSentMessageHandler) => (myPeerId: string | undefined, socketRef: MutableRefObject<WebSocket | undefined>, headers: Headers) => async (destination: string, message: string) => {
    const { selection, settings, verified } = state;
    if (bots.includes(destination)) return addSentMessage('', destination, message, genId());
    if (!myPeerId || !selection || !socketRef.current) return;
    const signature = verified && await signRequest(settings.httpEndpoint, headers)(message)
      .catch((err: any) => console.error('ERROR Failed to obtain signature', err));
    const encodedMessage = encodeMessage(myPeerId, message, signature);
    const id = genId();
    addSentMessage(myPeerId, destination, message, id);
    await sendMessage(settings.httpEndpoint, headers)(selection, encodedMessage, destination, id, updateMessage)
      .catch((err: any) => console.error('ERROR Failed to send message', err));
  };

  const handleReceivedMessage = (addReceivedMessage: ReceiveMessageHandler) => async (ev: MessageEvent<string>) => {
    try {
      // we are only interested in messages, not all the other events coming in on the socket
      const data = JSON.parse(ev.data);
      if (data.type == "message") {
        const { tag, from, message, signature } = decodeMessage(data.msg);

        const verifiedStatus : VerifiedStatus = signature ?
          // Messages are pre-pended with the padding to avoid generic signatures.
          (await verifySignatureFromPeerId(from, `HOPR Signed Message: ${message}`, signature) ?
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

  const loadWelcomeConversation = () => {
    console.log("⚙️  Welcome Messages.", process.env.NODE_ENV)
    addNewConversation(welcome)
    // setTimeout ensures the event loop takes these state updates in order.
    setTimeout(() => addReceivedMessage(welcome, 'Welcome to myne.chat!'), 0)
    setTimeout(() => addReceivedMessage(welcome, 'Did you know that myne.chat is the first dApp built on top of the HOPR protocol? 🟡👀'), 0)
    setTimeout(() => addReceivedMessage(welcome, 'But be aware! This is only the alpha version.'), 0)
    setTimeout(() => addReceivedMessage(welcome, 'To start a conversation on myne.chat please use our <a href="https://docs.hoprnet.org/dapps/myne-chat" style="color: white;" target="_blank">Tutorial</a>.', undefined, true), 0)
    setTimeout(() => addReceivedMessage(welcome, 'Have fun chatting!'), 0)
  }

  const loadDevHelperConversation = () => {
    console.log("⚙️  Developer Mode enabled.", process.env.NODE_ENV)
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
    },
    addSentMessage,
    addReceivedMessage,
    updateSettings,
    setSelection,
    setVerified,
    handleAddNewConversation,
    handleSendMessage,
    handleReceivedMessage,
    loadDevHelperConversation,
    loadWelcomeConversation,
    hash: MYNE_CHAT_GIT_HASH,
    version: MYNE_CHAT_VERSION,
    environment: MYNE_CHAT_ENVIRONMENT
  };
};

export default useAppState;
