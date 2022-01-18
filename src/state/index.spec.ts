import { renderHook } from '@testing-library/react-hooks'
import { privKeyToPeerId, u8aToHex } from '@hoprnet/hopr-utils'
import useAppState from '.'
import { MutableRefObject } from 'react'
import * as API from '../lib/api'


describe('App State', () => {
  const originalMessage = "This is a message to be signed"
  const recipientPeerId = "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs"
  const privateKey = '0xcb1e5d91d46eb54a477a7eefec9c87a1575e3e5384d38f990f19c09aa8ddd332'
  const mockPeerId = privKeyToPeerId(privateKey)
  const myPeerId = mockPeerId.toB58String();
  let mockedSignRequest;

  afterEach(() => {
    jest.resetAllMocks()
  })
  test("init", async () => {
    const signedMessage = u8aToHex(await mockPeerId.privKey.sign(
      new TextEncoder().encode(originalMessage)
    ))
    mockedSignRequest = jest.spyOn(API, 'signRequest').mockImplementation(
      (_endpoint: string, _headers: Headers) => (_encodeSignRequest: string): Promise<string> => {
        return Promise.resolve(signedMessage);
      });
    // Finally, we actually call our hook with the mocked API, and verify the calls.
    const { result } = renderHook(() => useAppState())

    result.current.handleSendMessage(myPeerId, {} as MutableRefObject<WebSocket | undefined>, {} as Headers)
    // As we have mocked the `useUser` hook, we can spy on its calls.
    expect(mockedSignRequest).not.toBeCalled();
  })
})