/*
  A react hook.
  Keeps user state updated whenever endpoint is changed.
*/
import { useEffect } from "react";
import { useImmer } from "use-immer";

const fetchPeerId = async (endpoint: string): Promise<string> => {
  return fetch(`${endpoint}/info`)
    .then((res) => res.json())
    .then((o) => o.peerId);
};

const useUser = (endpoint: string) => {
  const [state, setState] = useImmer<{
    endpoint: string;
    myPeerId?: string;
    error?: string;
  }>({ endpoint });

  // set new endpoint
  const setEndpoint = (endpoint: string) => {
    setState((draft) => {
      draft.endpoint = endpoint;
      return draft;
    });
  };

  // runs everytime "endpoint" changes
  useEffect(() => {
    if (typeof fetch === "undefined") return;
    console.info("Fetching user data..");

    fetchPeerId(state.endpoint)
      .then((peerId) => {
        console.info("Fetched PeerId", peerId);
        setState((draft) => {
          draft.myPeerId = peerId;
          return draft;
        });
      })
      .catch((err) => {
        console.error(err);
        setState((draft) => {
          draft.myPeerId = undefined;
          draft.error = err;
          return draft;
        });
      });
  }, [state.endpoint]);

  return {
    state,
    setEndpoint,
  };
};

export default useUser;
