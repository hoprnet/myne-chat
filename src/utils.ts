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
  return `${from}:${message}`;
};
export const decodeMessage = (
  encodedMessage: string
): { from: string; message: string } => {
  const [from, ...messages] = encodedMessage.split(":");
  const message = messages.join(":");

  if (!isValidPeerId(from)) {
    throw Error(
      `Message "${encodedMessage}" was sent from an invalid PeerID "${from}"`
    );
  }

  return {
    from,
    message,
  };
};

export const getUrlParams = (): Partial<Settings> => {
  if (typeof location === "undefined") return {};

  const params = new URLSearchParams(location.search);
  return {
    httpEndpoint: params.get("httpEndpoint") || undefined,
    wsEndpoint: params.get("wsEndpoint") || undefined,
    securityToken: params.get("securityToken") || undefined,
  };
};
