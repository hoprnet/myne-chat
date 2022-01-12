import { render, screen } from '@testing-library/react'
import HomePage from '../pages/index'
import * as nextRouter from 'next/router';

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe('Home', () => {
  it('renders a heading', () => {
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );
    render(<HomePage />)
  })
})