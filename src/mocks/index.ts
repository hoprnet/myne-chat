export type Message = {
  id: string;
  direction: "sent" | "received";
  time: number;
  content: string;
};

export const messages: Message[] = [
  {
    id: "1",
    direction: "sent",
    time: 123,
    content: "hello world",
  },
  {
    id: "2",
    direction: "received",
    time: 123,
    content: "hello back",
  },
];
