import type { Settings } from "./state";

/**
 * True if instance is running on server
 */
export const isSSR: boolean = typeof window === "undefined";

/**
 * Generates a pseudo random ID
 * @returns random string
 */
export const genId = () => String(Math.floor(Math.random() * 1e18));

export const PEER_ID_LENGTH = 53;

/**
 * @param v peerId
 * @returns true if 'v' is a valid peerId
 */
export const isValidPeerId = (v: string): boolean => {
  return (
    v.startsWith("16Uiu2HA") &&
    v.length === PEER_ID_LENGTH &&
    /[a-zA-Z0-9]*/.test(v)
  );
};

/**
 * Prepends messages with our app's tag so we can distinguish the
 * messages from other apps.
 * @param from
 * @param message
 * @returns encoded message
 */
export const encodeMessage = (from: string, message: string): string => {
  return `myne:${from}:${message}`;
};

/**
 * Decodes incoming message.
 * @param fullMessage
 * @returns
 */
export const decodeMessage = (
  fullMessage: string
): { tag: string; from: string; message: string } => {
  const [tag, from, ...messages] = fullMessage.split(":");
  const message = messages.join(":");

  if (!from || !isValidPeerId(from)) {
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
  const params = new URLSearchParams(location.search);
  return {
    httpEndpoint: params.get("httpEndpoint") || undefined,
    wsEndpoint: params.get("wsEndpoint") || undefined,
    securityToken: params.get("securityToken") || undefined,
  };
};
