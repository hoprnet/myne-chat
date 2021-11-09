type PeerId = string;

const self: PeerId = "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRthk4rF1rbY-self";
const counterpartyA: PeerId =
  "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRt-counterpartyA";
const counterpartyB: PeerId =
  "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRt-counterpartyB";

export type Message = {
  id: string;
  from: PeerId;
  direction: "sent" | "received";
  time: number;
  content: string;
};

export const messages: Message[] = [
  {
    id: "1",
    from: counterpartyA,
    time: +new Date("01/01/2021"),
    content: "hello world",
    direction: "received",
  },
  {
    id: "2",
    from: self,
    time: +new Date("01/02/2021"),
    content: "hello back",
    direction: "sent",
  },
];

export type Conversation = {
  with: PeerId;
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    with: counterpartyA,
    messages,
  },
  {
    with: counterpartyB,
    messages,
  },
];
