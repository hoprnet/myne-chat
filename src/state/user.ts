/*
  A react hook.
  Keeps user state updated whenever endpoint is changed.
*/
import type { Settings } from ".";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { isSSR } from "../utils";
import { accountAddress } from "../lib/api";

export type UserState = {
  myPeerId?: string;
  error?: string;
}

const useUser = (settings: Settings) => {
  const [state, setState] = useImmer<UserState>({});

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

  // runs everytime "apiEndpoint" changes
  useEffect(() => {
    if (isSSR) return;
    console.info("Fetching user data..");
    const headers = getReqHeaders()
    accountAddress(settings.apiEndpoint, headers)(setState);
  }, [settings?.apiEndpoint, settings?.securityToken]);

  return {
    state,
    getReqHeaders,
  };
};

export default useUser;
