/*
  A react hook.
  Keeps user state updated whenever endpoint is changed.
*/
import type { Settings } from ".";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { isSSR } from "../utils";

const useUser = (settings: Settings) => {
  const [state, setState] = useImmer<{
    myPeerId?: string;
    error?: string;
  }>({});

  // construct headers to be used in authenticated requests
  // when security token is present
  const getReqHeaders = (isPost: boolean = false) => {
    const headers = new Headers();
    if (isPost) {
      headers.set("Content-Type", "application/json");
      headers.set("Accept-Content", "application/json");
    }
    if (settings.securityToken) {
      headers.set("Authorization", "Basic " + btoa(settings.securityToken));
    }

    return headers;
  };

  // runs everytime "httpEndpoint" changes
  useEffect(() => {
    if (isSSR) return;
    console.info("Fetching user data..");

    fetch(`${settings.httpEndpoint}/api/v2/account/address`, {
      headers: getReqHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        console.info("Fetched PeerId", data.hoprAddress);
        setState((draft) => {
          draft.myPeerId = data.hoprAddress;
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
    getReqHeaders,
  };
};

export default useUser;
