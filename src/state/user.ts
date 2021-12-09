/*
  A react hook.
  Keeps user state updated whenever endpoint is changed.
*/
import type { Settings } from ".";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const fetchPeerId = async (
  endpoint: string,
  authCredentials?: string
): Promise<string> => {
  const headers = new Headers();
  if (authCredentials && authCredentials !== "") {
    headers.set("Authorization", "Basic " + btoa(authCredentials));
  }

  return fetch(`${endpoint}/api/v2/account/address`, { headers })
    .then((res) => res.json())
    .then((data) => {
      return data.hoprAddress;
    });
};

const useUser = (settings: Settings) => {
  const [state, setState] = useImmer<{
    myPeerId?: string;
    error?: string;
  }>({});

  // runs everytime "httpEndpoint" changes
  useEffect(() => {
    if (typeof fetch === "undefined") return;
    console.info("Fetching user data..");

    fetchPeerId(settings.httpEndpoint, settings.securityToken)
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
  }, [settings.httpEndpoint, settings.securityToken]);

  return {
    state,
  };
};

export default useUser;
