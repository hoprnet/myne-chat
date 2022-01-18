import { renderHook } from '@testing-library/react-hooks'
import { API as mockAPI } from '../lib/api'
import { privKeyToPeerId, u8aToHex } from '@hoprnet/hopr-utils'
import useAppState from '.'
import { DraftFunction } from 'use-immer'

const mockUserModule = jest.mock('./user')
import mockUseUser, { UserState } from './user'

describe('App State', () => {
  test("init", async () => {

    // We first mock the data and functions we want to ensure got called.
    const originalMessage = "This is a message to be signed"
    const recipientPeerId = "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs"
    const privateKey = '0xcb1e5d91d46eb54a477a7eefec9c87a1575e3e5384d38f990f19c09aa8ddd332'
    const mockPeerId = privKeyToPeerId(privateKey)
    const signer = mockPeerId.toB58String();

    const signedMessage = u8aToHex(await mockPeerId.privKey.sign(
      new TextEncoder().encode(originalMessage)
    ))
    const mockedSignRequest = jest.fn((_encodeSignRequest: string): string => {
      return signedMessage;
    });
    const mockAccountAddress = jest.fn((headers: Headers, setPeerId: (draft: DraftFunction<UserState>) => void) => {
      setPeerId((draft) => {
        draft.myPeerId = signer;
        return draft;
      });
    });

    // We proceed to mock the API implementation, only the needed methods.
    const api = mockAPI('localhost', {} as Headers);
    const mockedAPI = jest.fn().mockImplementation((_endpoint: string, _headers: Headers) => ({
      signRequest: mockedSignRequest,
      sendMessage: api.sendMessage,
      accountAddress: api.accountAddress
    }))
    mockUserModule.fn().mockImplementation(() => mockUseUser(mockedAPI))

    // Finally, we actually call our hook with the mocked API, and verify the calls.
    const { result } = renderHook(() => useAppState())
    // As we have mocked the `useUser` hook, we can spy on its calls.
    // expect(mockAccountAddress).toHaveBeenCalledWith()
    // result.current.handleSendMessage(recipientPeerId, originalMessage);
    
  })
})