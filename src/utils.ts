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
 * @param signature string (optional) - Signature of message from recipient
 * @returns encoded message
 */
export const encodeMessage = (from: string, message: string, signature?: string): string => {
  return `myne:${encodeSignedRecipient(from, signature)}:${message}`;
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
 * Encodes recipient with signature for later parsing
 * @param from string
 * @param signature strig
 * @returns encodedSignedRecipient string
 */
export const encodeSignedRecipient = (from: string, signature?: string): string => {
  return `${from}${signature ? `-${signature}` : ''}`
}


export type SignedRecipient = {
  from: string,
  signature?: string
}

/**
 * Decodes recipient to obtain signature if any
 * @param maybeSignedRecipient string
 * @returns SignedRecipient
 */
 export const decodeSignedRecipient = (maybeSignedRecipient: string): SignedRecipient => {
  const [from, signature] = maybeSignedRecipient.includes('-') ? maybeSignedRecipient.split('-') : [maybeSignedRecipient]
  return { from, signature }
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
): { tag: string; from: string; message: string, signature: string | undefined } => {
  const [tag, maybeSignedRecipient, ...messages] = fullMessage.split(":");
  const message = messages.join(":");

  const {from, signature} = decodeSignedRecipient(maybeSignedRecipient);

  if (!from || !isValidPeerId(from)) {
    throw Error(
      `Received message "${fullMessage}" was sent from an invalid PeerID "${from}"`
    );
  }

  return {
    tag,
    from,
    message,
    signature
  };
};

/**
 * Inspects the url to find valid settings.
 * @returns settings found in url query
 */
export const getUrlParams = (loc: Location): Partial<Settings> => {
  const params = new URLSearchParams(loc.search);
  return {
    apiEndpoint: params.get("apiEndpoint") || undefined,
    apiToken: params.get("apiToken") || undefined,
  };
};
