import React, { useContext } from "react";
import { useImmer, useImmerReducer } from "use-immer";
import { Message, VerifiedStatus } from "../state";
import { genId } from "../utils";

export type ConversationsState = {
  conversations: Map<string, Map<string, Message>>;
  selection?: string;
};

export type UpdateMessageHandlerInterface = (counterparty: string, messageId: string, status: Message["status"], error?: string | undefined) => void

export type ConversationsAction = {
  type: 'ADD_NEW_CONVERSATION'
  peerId: string
} | {
  type: 'ADD_RECEIVED_MESSAGE'
  from: string
  content: string
  verifiedStatus?: VerifiedStatus
} | {
  type: 'ADD_SENT_MESSAGE'
  id: string,
  myPeerId: string,
  destination: string,
  content: string,
  verifiedStatus?: VerifiedStatus
} | {
  type: 'UPDATE_MESSAGE'
  counterparty: string,
  messageId: string,
  status: Message["status"],
  error?: string
}

function conversationsReducer(draft: ConversationsState, action: ConversationsAction) {
  switch (action.type) {
    case "ADD_NEW_CONVERSATION":
      const { peerId } = action;
      console.log("peerId", peerId)
      if (!draft.conversations.has(peerId)) {
        console.log("Adding peerId", peerId)
        draft.conversations.set(peerId, new Map<string, Message>());
      }
      draft.selection = peerId;
      console.log("DRAFT 2", draft.selection, draft.conversations)
      break;
    case "ADD_RECEIVED_MESSAGE":
      const { from, verifiedStatus } = action;
      const fromMessages = draft.conversations.get(from) || new Map<string, Message>();
      const generatedReceivedId = genId();
      draft.conversations.set(
        from,
        fromMessages.set(generatedReceivedId, {
          id: genId(),
          isIncoming: true,
          content: action.content,
          status: "SUCCESS",
          createdBy: from,
          createdAt: +new Date(),
          verifiedStatus
        })
      );
      break;
    case 'ADD_SENT_MESSAGE':
      const { destination, myPeerId, id } = action;
      const sentMessages = draft.conversations.get(destination) || new Map<string, Message>();
      draft.conversations.set(
        destination,
        sentMessages.set(id, {
          id,
          isIncoming: false,
          content: action.content,
          status: "UNKNOWN",
          createdBy: myPeerId,
          createdAt: +new Date(),
          verifiedStatus,
        })
      );
      break;
    case 'UPDATE_MESSAGE':
      const { status, counterparty, messageId, error } = action;
      const conversations = draft.conversations.get(counterparty);
      if (!conversations) return draft;
      const message = conversations.get(messageId);
      if (!message) return draft;
      message.status = status;
      message.error = error;
      conversations.set(messageId, message);
      break;
  }
}

const initialState: ConversationsState = { conversations: new Map([]) }

export const useConversations = () => {
  return useImmerReducer<ConversationsState, ConversationsAction>(
    conversationsReducer,
    initialState
  );
}