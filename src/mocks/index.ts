export type Message = {
  id: string;
  from: string;
  direction: "sent" | "received";
  time: number;
  content: string;
};

export const messages: Message[] = [
  {
    id: "1",
    from: "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRthk4rF1rbYbQ77",
    time: +new Date("01/01/2021"),
    content: "hello world",
    direction: "received",
  },
  {
    id: "2",
    from: "16Uiu2HAm5ayHUYnv1tAQCrzceJgNnYzvWCZYiRthk4rF1rbYbQ77",
    time: +new Date("01/02/2021"),
    content: "hello back",
    direction: "sent",
  },
];
