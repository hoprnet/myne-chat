/*
  A react hook.
  Keeps user state updated whenever endpoint is changed.
*/
import { useEffect } from "react";
import { useImmer } from "use-immer";

const fetchPeerId = async (
  endpoint: string,
  authCredentials: string
): Promise<string> => {
  const headers = new Headers();
  if (authCredentials && authCredentials !== "") {
    headers.set("Authorization", "Basic " + btoa(authCredentials));
  }

  return fetch(`${endpoint}api/v2/account/address`, { headers })
    .then((res) => {
      const data = res.json();
      return data.hoprAddress;
    })
    .then((o) => o.peerId);
};

const useUser = (endpoint: string) => {
  // extract auth credentials if present
  const url = new URL(endpoint);
  endpoint = `${url.protocol}//${url.host}${url.pathname}`;
  const [state, setState] = useImmer<{
    endpoint: string;
    endpointAuthCredentials: string;
    myPeerId?: string;
    error?: string;
  }>({ endpoint, endpointAuthCredentials: `${url.username}:${url.password}` });

  // set new endpoint
  const setEndpoint = (endpoint: string) => {
    // extract auth credentials if present
    const url = new URL(endpoint);
    setState((draft) => {
      draft.endpointAuthCredentials = `${url.username}:${url.password}`;
      draft.endpoint = `${url.protocol}//${url.host}${url.pathname}`;
      return draft;
    });
  };

  // runs everytime "endpoint" changes
  useEffect(() => {
    if (typeof fetch === "undefined") return;
    console.info("Fetching user data..");

    fetchPeerId(state.endpoint, state.endpointAuthCredentials)
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
