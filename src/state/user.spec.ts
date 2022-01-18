import { renderHook } from '@testing-library/react-hooks'
import useUser, { UserState } from './user'
import { Settings } from '.'
import { DraftFunction } from 'use-immer'
import * as API from '../lib/api'

describe('User State', () => {
  const mockedAccount = '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs'
  let mockedAccountAddress: jest.SpyInstance<(setPeerId: (draft: DraftFunction<UserState>) => void) => Promise<void>, [endpoint: string, headers: Headers]>;
  beforeEach(() => {
    mockedAccountAddress = jest.spyOn(API, 'accountAddress').mockImplementation(
      (_endpoint: string, _headers: Headers) => (setPeerId: (draft: DraftFunction<UserState>) => void): Promise<void> => {
      return Promise.resolve(setPeerId((draft) => {
        draft.myPeerId = mockedAccount;
        return draft;
      }));
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  test("init", async () => {
    const settings = {} as Settings;
    // Finally, we actually call our hook with the mocked API, and verify the calls.
    const { result } = renderHook(() => useUser(settings));

    // Expect our mock to had been called and the state updated as reflected.
    expect(mockedAccountAddress).toBeCalled()
    expect(result.current.state.myPeerId).toBe(mockedAccount)
  })
})