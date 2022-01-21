import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import HomePage from '../pages/index'
import * as nextRouter from 'next/router';


jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe('HomePage', () => {
  it('renders the link', async () => {
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );
    render(<HomePage />)

    const anchor = screen.getByRole('link', {
      name: /Privacy powered by HOPR/i,
    })

    await waitFor(() => {
      expect(anchor).toBeInTheDocument()  
    })
    
  })
})