import { privKeyToPeerId, u8aConcat, u8aToHex } from '@hoprnet/hopr-utils'
import {
  encodeSignMessageRequest,
  decodeMessage,
  encodeMessage,
  getUrlParams,
  isValidPeerId,
  verifyAuthenticatedMessage,
  encodeSignedRecipient,
  decodeSignedRecipient,
} from "./utils";

// see https://github.com/hoprnet/hoprnet/blob/master/packages/core/src/index.ts#L865-L870
const HOPR_PREFIX = "HOPR Signed Message: ";

test("isValidPeerId", () => {
  expect(
    isValidPeerId("16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs")
  ).toBe(true);
  expect(
    [
      "06Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs",
      "1",
      "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvH",
      "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs1",
    ].every((p) => !isValidPeerId(p))
  ).toBe(true);
});

test("encodeMessage", () => {
  expect(
    encodeMessage(
      "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs",
      "hello"
    )
  ).toEqual(`myne:16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs:hello`);
});

test("encodeMessage (with signature)", () => {
  expect(
    encodeMessage(
      "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs",
      "hello",
      "signature"
    )
  ).toEqual(`myne:16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs-signature:hello`);
});

test("decodeMessage", () => {
  expect(
    decodeMessage(
      `myne:16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs:hello`
    )
  ).toEqual({
    tag: "myne",
    from: "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs",
    message: "hello",
  });
});

test("decodeMessage (with signature)", () => {
  expect(
    decodeMessage(
      `myne:16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs-signature:hello`
    )
  ).toEqual({
    tag: "myne",
    from: "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs",
    message: "hello",
    signature: "signature"
  });
});

test("encodeSignedRecipient", () => {
  expect(
    encodeSignedRecipient(
      '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs', 'signature'
    )
  ).toEqual('16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs-signature')
})

test("encodeSignedRecipient (empty)", () => {
  expect(
    encodeSignedRecipient(
      '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs',
    )
  ).toEqual('16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs')
})

test("decodeSignedRecipient", () => {
  expect(
    decodeSignedRecipient(
      '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs-signature'
    )
  ).toEqual({ from: '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs', signature: 'signature' })
})

test("decodeSignedRecipient (empty)", () => {
  expect(
    decodeSignedRecipient(
      '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs'
    )
  ).toEqual({ from: '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs' })
})

test("encoding/decoding signed recipients roundtrip", () => {
  const from = '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs'
  const signature = 'signature'
  expect(decodeSignedRecipient(encodeSignedRecipient(from, signature))).toEqual({ from, signature })
  expect(decodeSignedRecipient(encodeSignedRecipient(from))).toEqual({ from })
})

test("encoding/decoding message roundtrip", () => {
  const from = '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs'
  const message = 'message'
  const signature = 'signature'
  expect(decodeMessage(encodeMessage(from, message, signature))).toEqual({ from, message, signature, tag: 'myne' })
  expect(decodeMessage(encodeMessage(from, message ))).toEqual({ from, message, tag: 'myne' })
})

test("getUrlParams", () => {
  const location = {
    search: "?apiToken=hello",
  };

  expect(getUrlParams(location as any)).toEqual({
    apiToken: "hello",
  });
});


test("encodeSignMessageRequest", () => {
  const message = "This is the message";
  const recipient = "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs";
  expect(encodeSignMessageRequest(message, recipient)).toEqual(`myne:sign:${recipient}:${message}`)
})

test("verifyAuthenticatedMessage:false", async () => {
  const signedMessage = "0x";
  const originalMessage = "invalid";
  const signer = "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs";
  expect(await verifyAuthenticatedMessage(originalMessage, signedMessage, signer)).toEqual(false)
})

test("verifyAuthenticatedMessage:true", async () => {
  const originalMessage = `${HOPR_PREFIX}This is a message to be signed`
  const privateKey = '0xcb1e5d91d46eb54a477a7eefec9c87a1575e3e5384d38f990f19c09aa8ddd332'
  const mockPeerId = privKeyToPeerId(privateKey)
  const signer = mockPeerId.toB58String();

  const signedMessage = u8aToHex(await mockPeerId.privKey.sign(
    new TextEncoder().encode(originalMessage)
  ))
  expect(await verifyAuthenticatedMessage(originalMessage, signedMessage, signer)).toEqual(true)
})

test("verifyAuthenticateMessage:true (from hopr-admin)", async() => {
  const originalMessage = `${HOPR_PREFIX}This should be working.`
  const signer = '16Uiu2HAmN4enEu9822TMgG52goik85yEs4MqDdErtsGr8fy86VDQ'
  const signedMessage = '0x3045022100d9a8c2100ffa55aa5856889055bdf0e10f9831e2e695b3ad986c7692c5b9b35202201f00817c430bd72a2f64b92787f0a0947783d79fd9184d8031c998831c11c90d'

  expect(await verifyAuthenticatedMessage(originalMessage, signedMessage, signer)).toEqual(true)
})

test("verifyAuthenticateMessage:true (from myne-chat)", async () => {
  const originalMessage = `${HOPR_PREFIX}This is a valid message.`
  const signer = '16Uiu2HAm1fsKzaBjw8d4R8aQTRHRYM87LdBCtVEuMpgxs2CWv1Qk'
  const signedMessage = '0x3044022018ba5a5e29e43e232f5b66235b56ba24598f11e68150c05c916ab0f96b5a959b02203b2fb23d8233787160753c0c8cc2fc459e5ef89137b8144cf5da018fd4d2580c'

  expect(await verifyAuthenticatedMessage(originalMessage, signedMessage, signer)).toEqual(true)
})

test("verifyAuthenticateMessage:true (from api)", async() => {
  const originalMessageInUa8 = u8aConcat(
    new TextEncoder().encode(HOPR_PREFIX),
    new Uint8Array([ // the message reads "This is a valid message."
      84, 104, 105, 115,  32, 105, 115,
      32,  97,  32, 118,  97, 108, 105,
    100,  32, 109, 101, 115, 115,  97,
    103, 101,  46
  ])
)
 const originalMessage = new TextDecoder().decode(originalMessageInUa8)
 const signer = '16Uiu2HAm1fsKzaBjw8d4R8aQTRHRYM87LdBCtVEuMpgxs2CWv1Qk'
 const signedMessageInUa8 = new Uint8Array([ // the signature of the message "HOPR Signed Message: This is a valid message."
  48, 68,   2,  32,  24, 186,  90,  94,  41, 228,  62,  35,
  47, 91, 102,  35,  91,  86, 186,  36,  89, 143,  17, 230,
 129, 80, 192,  92, 145, 106, 176, 249, 107,  90, 149, 155,
   2, 32,  59,  47, 178,  61, 130,  51, 120, 113,  96, 117,
  60, 12, 140, 194, 252,  69, 158,  94, 248, 145,  55, 184,
  20, 76, 245, 218,   1, 143, 212, 210,  88,  12
])
const signedMessage = u8aToHex(signedMessageInUa8) // We use u8aToHex as verifyAuthenticateMessage (arrayify) expects a `0x` based string
console.log("ORIGINAL MESSAGE", originalMessage);
console.log("SIGNED MESSAGE", signedMessage);
expect(await verifyAuthenticatedMessage(originalMessage, signedMessage, signer)).toEqual(true)
})
