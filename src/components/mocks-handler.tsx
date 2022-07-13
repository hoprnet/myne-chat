import { useEffect, useState } from "react"
import useWebsocket from "../state/websocket";
import { decodeMessage } from "../utils";

export const MocksHandler: React.FC<{ 
  apiEndpoint: string,
  wsEndpoint: string,
  transform?: (message: string) => string
}> = ({
  apiEndpoint,
  wsEndpoint,
  transform = (msg) => `You have received a message from ${msg}`
}): JSX.Element => {
  const [message, setMessage] = useState("")
  const websocket = useWebsocket({ apiEndpoint, wsEndpoint });
  const { socketRef } = websocket;
  const handleReceivedMessage = async (ev: MessageEvent<string>) => {
    try {
      // we are only interested in messages, not all the other events coming in on the socket
      const data = JSON.parse(ev.data);
      if (data.type == "message") {
        const { from } = decodeMessage(data.msg);
        setMessage(transform(from))
      }
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.addEventListener("message", handleReceivedMessage);

    return () => {
      if (!socketRef.current) return;
      socketRef.current.removeEventListener("message", handleReceivedMessage);
    };
  }, [socketRef.current]);

  return (<span>{ message ? message : "You have no messages." }</span>)
}
