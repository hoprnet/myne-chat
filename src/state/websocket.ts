/*
  A react hook.
  Keeps websocket connection alive, reconnects on disconnections or endpoint change.
*/
import { useEffect, useRef } from "react";
import { useImmer } from "use-immer";

export type ConnectionStatus = "CONNECTED" | "DISCONNECTED";

const useWebsocket = (endpoint: string) => {
  const [state, setState] = useImmer<{
    status: ConnectionStatus;
    endpoint: string;
    error?: string;
  }>({ status: "DISCONNECTED", endpoint });

  const socketRef = useRef<WebSocket>();

  const setEndpoint = (endpoint: string) => {
    setState((draft) => {
      draft.endpoint = endpoint;
      return draft;
    });
  };

  const handleOpenEvent = () => {
    console.info("WS CONNECTED");
    setState((draft) => {
      draft.status = "CONNECTED";
      return draft;
    });
  };

  const handleCloseEvent = () => {
    console.info("WS DISCONNECTED");
    setState((draft) => {
      draft.status = "DISCONNECTED";
      return draft;
    });
  };

  const handleErrorEvent = (e: Event) => {
    console.error("WS ERROR", e);
    setState((draft) => {
      draft.error = String(e);
    });
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
    socketRef.current.addEventListener("open", handleOpenEvent);
    // handle connection closing
    socketRef.current.addEventListener("close", handleCloseEvent);
    // handle errors
    socketRef.current.addEventListener("error", handleErrorEvent);

    // cleanup when unmounting
    return () => {
      if (!socketRef.current) return;

      socketRef.current.removeEventListener("open", handleOpenEvent);
      socketRef.current.removeEventListener("close", handleCloseEvent);
      socketRef.current.removeEventListener("error", handleErrorEvent);
    };
  }, [endpoint]);

  return {
    state,
    socketRef,
    setEndpoint,
  };
};

export default useWebsocket;
