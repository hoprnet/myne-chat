type PeerId = string;

const SELF: PeerId = "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRthk4rF1rbY-self";
const COUNTERPARTY_A: PeerId =
  "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRt-counterpartyA";
const COUNTERPARTY_B: PeerId =
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
    from: COUNTERPARTY_A,
    time: +new Date("01/01/2021"),
    content: "hello world",
    direction: "received",
  },
  {
    id: "2",
    from: SELF,
    time: +new Date("01/02/2021"),
    content: "hello back",
    direction: "sent",
  },
];

export type Conversation = {
  with: PeerId;
  messages: Message[];
};

// cloning object as it breaks react? jesus..
export const conversations: Conversation[] = [
  {
    with: COUNTERPARTY_A,
    messages: Object.assign({}, messages),
  },
  {
    with: COUNTERPARTY_B,
    messages: Object.assign({}, messages),
  },
];
