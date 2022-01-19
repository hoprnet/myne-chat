import { privKeyToPeerId, u8aToHex } from '@hoprnet/hopr-utils'
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
    search: "?securityToken=hello",
  };

  expect(getUrlParams(location as any)).toEqual({
    securityToken: "hello",
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
  const originalMessage = "This is a message to be signed"
  const privateKey = '0xcb1e5d91d46eb54a477a7eefec9c87a1575e3e5384d38f990f19c09aa8ddd332'
  const mockPeerId = privKeyToPeerId(privateKey)
  const signer = mockPeerId.toB58String();

  const signedMessage = u8aToHex(await mockPeerId.privKey.sign(
    new TextEncoder().encode(originalMessage)
  ))
  expect(await verifyAuthenticatedMessage(originalMessage, signedMessage, signer)).toEqual(true)
})

test("verifyAuthenticateMessage:true (from snapshot)", async() => {
  const originalMessage = 'HOPR Signed Message: This should be working.'
  const signer = '16Uiu2HAmN4enEu9822TMgG52goik85yEs4MqDdErtsGr8fy86VDQ'
  const signedMessage = '0x3045022100d9a8c2100ffa55aa5856889055bdf0e10f9831e2e695b3ad986c7692c5b9b35202201f00817c430bd72a2f64b92787f0a0947783d79fd9184d8031c998831c11c90d'

  expect(await verifyAuthenticatedMessage(originalMessage, signedMessage, signer)).toEqual(true)
})