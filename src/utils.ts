import type { Settings } from "./state";
import { arrayify } from '@ethersproject/bytes'
import PeerId from "peer-id";

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
 * Prepends message as a signature request to be sent to our HOPR's node for signing.
 * @param message string
 * @returns string
 */
export const encodeSignMessageRequest = (message: string, recipient: string) => {
  return `myne:sign:${recipient}:${message}`;
}

/**
 * Copied from @hoprnet/hopr-utils until web support is provided
 * https://github.com/hoprnet/hoprnet/blob/059250384a04463fa1d1068dde38697ce683c817/packages/utils/src/libp2p/verifySignatureFromPeerId.ts#L15-L18
 */
 export async function verifySignatureFromPeerId(peerId: string, message: string, signature: string): Promise<boolean> {
  const pId = PeerId.createFromB58String(peerId)
  return await pId.pubKey.verify(new TextEncoder().encode(message), arrayify(signature))
}

/**
 * Verifies signed message given a specific Base58 string
 * @param originalMessage string
 * @param signedMessage string
 * @param signer string
 * @returns boolean
 */
export const verifyAuthenticatedMessage = async (originalMessage: string, signedMessage: string, signer: string) => {
  return await verifySignatureFromPeerId(signer, originalMessage, signedMessage);
}

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
export const getUrlParams = (loc: Location): Partial<Settings> => {
  const params = new URLSearchParams(loc.search);
  return {
    httpEndpoint: params.get("httpEndpoint") || undefined,
    wsEndpoint: params.get("wsEndpoint") || undefined,
    securityToken: params.get("securityToken") || undefined,
  };
};
