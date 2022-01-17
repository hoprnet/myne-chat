import { renderHook } from '@testing-library/react-hooks'
import useAppState from '.'

describe('State', () => {
  test("useAppState", async () => {
    const { result } = renderHook(() => useAppState())

  })
})