import { act, renderHook } from '@testing-library/react-hooks'
import useUser, { UserState } from './user'
import { Settings } from '.'
import { API } from '../lib/api'
import { DraftFunction } from 'use-immer'

describe('State', () => {
  test("userState", async () => {
    const settings = {} as Settings;
    // We first mock the data and functions we want to ensure got called.
    const mockPeerId = '0x'
    const mockAccountAddress = jest.fn((headers: Headers, setPeerId: (draft: DraftFunction<UserState>) => void) => {
      setPeerId((draft) => {
        draft.myPeerId = mockPeerId;
        return draft;
      });
    });

    // We proceed to mock the API implementation, only the needed methods.
    const api = API('localhost', {} as Headers);
    const mockedAPI = jest.fn().mockImplementation((endpoint: string, headers: Headers) => ({
      signRequest: api.signRequest,
      sendMessage: api.sendMessage,
      accountAddress: mockAccountAddress
    }))
    
    // Finally, we actually call our hook with the mocked API, and verify the calls.
    const { result } = renderHook(() => useUser(mockedAPI)(settings))

    // Expect our mock to had been called and the state updated as reflected.
    expect(mockAccountAddress).toBeCalled()
    expect(result.current.state.myPeerId).toBe(mockPeerId)
  })
})