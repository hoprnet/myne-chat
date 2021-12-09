import type { Settings } from "./state";

// simple ID generator
export const genId = () => String(Math.floor(Math.random() * 1e18));

// validate PeerIds
export const PEER_ID_LENGTH = 53;
export const isValidPeerId = (v: string): boolean => {
  return (
    v.startsWith("16Uiu2HA") &&
    v.length === PEER_ID_LENGTH &&
    /[a-zA-Z0-9]*/.test(v)
  );
};

// message encoding / decoding
export const encodeMessage = (from: string, message: string): string => {
  // we prepends messages with our app's tag so we can distinguish the
  // messages from other apps
  return `myne:${from}:${message}`;
};
export const decodeMessage = (
  fullMessage: string
): { tag: string; from: string; message: string } => {
  const [tag, from, ...messages] = fullMessage.split(":");
  const message = messages.join(":");

  if (!isValidPeerId(from)) {
    throw Error(
      `Received message "${fullMessage}" was sent from an invalid PeerID "${from}"`
    );
  }

  return {
    tag,
    from,
    message,
  };
};

/**
 * Inspects the url to find valid settings.
 * @returns settings found in url query
 */
export const getUrlParams = (): Partial<Settings> => {
  // don't run server-side
  if (typeof location === "undefined") return {};

  const params = new URLSearchParams(location.search);
  return {
    httpEndpoint: params.get("httpEndpoint") || undefined,
    wsEndpoint: params.get("wsEndpoint") || undefined,
    securityToken: params.get("securityToken") || undefined,
  };
};
