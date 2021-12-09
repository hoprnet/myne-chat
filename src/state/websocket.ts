/*
  A react hook.
  Keeps websocket connection alive, reconnects on disconnections or endpoint change.
*/
import type { Settings } from ".";
import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { debounce } from "lodash";

export type ConnectionStatus = "CONNECTED" | "DISCONNECTED";

const useWebsocket = (settings: Settings) => {
  // update timestamp when you want to reconnect to the websocket
  const [reconnectTmsp, setReconnectTmsp] = useState<number>();
  const [state, setState] = useImmer<{
    status: ConnectionStatus;
    error?: string;
  }>({ status: "DISCONNECTED" });

  const socketRef = useRef<WebSocket>();

  const setReconnectTmspDebounced = debounce((timestamp: number) => {
    setReconnectTmsp(timestamp);
  }, 1e3);

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
    setReconnectTmspDebounced(+new Date());
  };

  const handleErrorEvent = (e: Event) => {
    console.error("WS ERROR", e);
    setState((draft) => {
      draft.status = "DISCONNECTED";
      draft.error = String(e);
    });
    setReconnectTmspDebounced(+new Date());
  };

  // runs everytime "endpoint" or "reconnectTmsp" changes
  useEffect(() => {
    if (typeof WebSocket === "undefined") return;

    // disconnect from previous connection
    if (socketRef.current) {
      socketRef.current.close(1000, "Shutting down");
    }

    socketRef.current = new WebSocket(settings.wsEndpoint);

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
  }, [settings.wsEndpoint, settings.securityToken, reconnectTmsp]);

  return {
    state,
    socketRef,
  };
};

export default useWebsocket;
