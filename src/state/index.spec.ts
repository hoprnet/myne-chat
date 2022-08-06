import { act, renderHook } from '@testing-library/react-hooks'
import { privKeyToPeerId, u8aToHex } from '@hoprnet/hopr-utils'
import useAppState, { DEFAULT_SETTINGS, ReceiveMessageHandler, UpdateMessageHandlerInterface } from '.'
import { MutableRefObject } from 'react'
import { enableMapSet } from "immer";
import * as API from '../lib/api'
import * as Utils from '../utils'


describe('App State', () => {
  const originalMessage = "This is a message to be signed"
  const recipientPeerId = "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs"
  const privateKey = '0xcb1e5d91d46eb54a477a7eefec9c87a1575e3e5384d38f990f19c09aa8ddd332'
  const mockPeerId = privKeyToPeerId(privateKey)
  const myPeerId = mockPeerId.toB58String();
  let mockedSignRequest, mockedSendMessage;

  afterEach(() => {
    jest.resetAllMocks()
  })
  test("basic init state", async () => {
    const { result } = renderHook(() => useAppState())
    // No selection for the first `useEffect`
    expect(result.current.state.selection).toBeUndefined()
    // Settings should be the default ones
    expect(result.current.state.settings).toEqual(DEFAULT_SETTINGS)
    // Verified should be false
    expect(result.current.state.verified).toBeFalsy();
  })

  test("handleSendMessage\\handleReceiveMessage", async () => {
    // We create a valid signed message to be used in our mocks.
    const signedMessage = u8aToHex(await mockPeerId.privKey.sign(
      new TextEncoder().encode("HOPR Signed Message: "+originalMessage)
    ))
    const id = Utils.genId();
    const headers = {} as Headers;
    const socketRef = jest.fn().mockImplementation(() => ({} as MutableRefObject<WebSocket | undefined>))() as MutableRefObject<WebSocket | undefined>;
    const mockedActualSignRequest = jest.fn((_encodeSignRequest: string): Promise<string> => {
      return Promise.resolve(signedMessage);
    })
    const mockedActualSendMessage = jest.fn((recipient: string, body: string, destination: string, id: string, updateMessage: UpdateMessageHandlerInterface): Promise<void> => {
      return Promise.resolve();
    })
    mockedSignRequest = jest.spyOn(API, 'signRequest').mockImplementation((_endpoint: string, _headers: Headers) => mockedActualSignRequest);
    mockedSendMessage = jest.spyOn(API, 'sendMessage').mockImplementation((_endpoint: string, _headers: Headers) => mockedActualSendMessage);
    jest.spyOn(Utils, 'genId').mockReturnValue(id);

    const { result } = renderHook(() => useAppState())
    // This should immediately exit as websocket is empty, thus not calling our mock.
    await act(() => result.current.handleSendMessage(result.current.addSentMessage)(myPeerId, {} as MutableRefObject<WebSocket | undefined>, headers)(recipientPeerId, originalMessage));
    expect(mockedSignRequest).not.toHaveBeenCalled();

    // Let's update verified/selection so we can enter the verified method.
    act(() => {
      result.current.setVerified(true)
      result.current.setSelection(recipientPeerId)
    })
    expect(result.current.state.verified).toBeTruthy();
    expect(result.current.state.selection).toEqual(recipientPeerId);
    // Let's mock `socketRef.current` to enter in the actual method
    socketRef.current = {} as WebSocket;

    // Let's test the actual method
    await act(async () => {
      enableMapSet(); // Required by useImmer as we use maps
      await result.current.handleSendMessage(result.current.addSentMessage)(myPeerId, socketRef, headers)(recipientPeerId, originalMessage)
    });
    expect(mockedSignRequest).toHaveBeenCalledWith(result.current.state.settings.apiEndpoint, headers);
    expect(mockedActualSignRequest).toHaveBeenCalledWith(originalMessage);
    const actualMessageAfterEncoding = Utils.encodeMessage(myPeerId, originalMessage, signedMessage);
    expect(mockedSendMessage).toHaveBeenCalledWith(result.current.state.settings.apiEndpoint, headers);
    expect(mockedActualSendMessage).toHaveBeenCalledWith(recipientPeerId, actualMessageAfterEncoding, recipientPeerId, id, expect.any(Function));

    // Now let's do the entire loopback
    const mockedReceivedMessageHandler = jest.fn() as ReceiveMessageHandler;
    // @TODO: Format the message from the API v2, ideally from @hoprnet/utils
    const mockedEventData = { data: `{ "msg": "${actualMessageAfterEncoding}", "type": "message"}` } as MessageEvent<string>;
    // Testing the actual method
    await act(async () => await result.current.handleReceivedMessage(mockedReceivedMessageHandler)(mockedEventData))
    // Final check on based on the expected response
    expect(mockedReceivedMessageHandler).toHaveBeenCalledWith(myPeerId, originalMessage, 'VERIFIED');
  })
})
