import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import HomePage from '../pages/index'
import * as nextRouter from 'next/router';


jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

afterEach(() => {
  jest.resetAllMocks();
})

describe('HomePage', () => {
  it('renders the website, connects to mock servers', async () => {
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ hoprAddress: '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs' }),
      })
    );
    const spiedErrorConsole = jest.spyOn(console, 'error');
    const { getByRole } = render(<HomePage />)
    const anchor = getByRole('link', {
      name: /Privacy powered by HOPR/i,
    })
    await waitFor(() => {
      expect(anchor).toBeInTheDocument()  
    })
    expect(spiedErrorConsole).not.toBeCalled();
  })
})