import React from 'react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import WS from 'jest-websocket-mock'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '../pages/index'
import * as nextRouter from 'next/router';
import "isomorphic-fetch";


const server = setupServer(
  rest.get('http://localhost:3001/api/v2/account/address', (req, res, ctx) => {
    return res(ctx.json({hoprAddress: '16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs' }))
  }),
)
let mockServer;

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => mockServer = new WS('ws://localhost:3000'));
beforeAll(() => server.listen())
afterEach(() => {
  jest.resetAllMocks();
  server.resetHandlers();
  WS.clean();
})
afterAll(() => server.close())

describe('HomePage', () => {
  it('renders the website, connects to mock servers', async () => {
    const spiedErrorConsole = jest.spyOn(console, 'error');
    const spiedFetch = jest.spyOn(window, 'fetch')
    const getApiResult = (): Promise<any> => spiedFetch.mock.results[0].value;

    render(<HomePage />)

    await screen.findByRole('link', {name: /Privacy powered by HOPR/i})
    const addPeerId = await screen.findByRole('button', {name: /Add Peer Id/i})

    // We need to await for the API result since we do res.json()
    // @TODO: Consider replacing `fetch` for `axios` to avoid these workarounds
    await waitFor(() => expect(spiedFetch).toHaveBeenCalled())
    await waitFor(async () => expect(await getApiResult()).not.toBeUndefined())
    expect(spiedErrorConsole).not.toBeCalled();

    // We ensure we can click on the "Add" button, which means we are connected
    userEvent.click(addPeerId);
    const addPeerInput = await screen.findByRole('textbox', { name: /Peer Id/i })
    expect(addPeerInput).toBeInTheDocument()
  })
})