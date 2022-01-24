import { signRequest, sendMessage, accountAddress } from './api'

describe('API', () => {
  test("signRequest (success)", async () => {
    const signature = "0x304402201065a95fd22fc3e48266c3b270ace032489b0177e07d33c59e0d13dccc89108402205f41fb911bcfe485a8e58162ebce90382dc96ccafff378e5c8960e07efcf9e92"
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ signature }),
      })
    );
    expect(
      await signRequest('localhost', {} as Headers)("myne:sign:empty:empty")
    ).toEqual(signature)
  })

  test("signRequest (failure)", async () => {
    const err = 'SIGNATURE_FATAL_ERROR';
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() => Promise.reject(err));
    expect(
      await signRequest('localhost', {} as Headers)("myne:sign:empty:empty")
    ).toEqual(err)
  })

  test("sendMessage (success)", async () => {
    const handler = jest.fn().mockResolvedValue(true)
    const destination = "destination"
    const id = "0"
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() => Promise.resolve({ status: 204 }));
    await sendMessage('localhost', {} as Headers)("0x", "message", destination, id, handler)
    expect(handler).toHaveBeenCalledWith(destination, id, 'SUCCESS');
  })

  test("sendMessage (failure)", async () => {
    const handler = jest.fn().mockResolvedValue(true)
    const destination = "destination"
    const error = 'SENDMESSAGE_FAILED_VERIFICATION'
    const id = "0"
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() => Promise.resolve({ status: 422, json: () => Promise.resolve({ error }) }));
    await sendMessage('localhost', {} as Headers)("0x", "message", destination, id, handler)
    expect(handler).toHaveBeenCalledWith(destination, id, 'FAILURE', error);
  })

  test("sendMessage (rejection)", async () => {
    const handler = jest.fn().mockResolvedValue(true)
    const destination = "destination"
    const error = 'SENDMESSAGE_REJECTED_ERROR'
    const id = "0"
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() => Promise.reject(error));
    await sendMessage('localhost', {} as Headers)("0x", "message", destination, id, handler)
    expect(handler).toHaveBeenCalledWith(destination, id, 'FAILURE', error);
  })

  test("sendMessage (unknown)", async () => {
    const handler = jest.fn().mockResolvedValue(true)
    const destination = "destination"
    const HARDCODED_ERR_VALUE_WITHIN_FUNCTION = 'Unknown response status.'
    const id = "0"
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() => Promise.resolve({ status: 418, '🫖': '🫖' }));
    await sendMessage('localhost', {} as Headers)("0x", "message", destination, id, handler)
    expect(handler).toHaveBeenCalledWith(destination, id, 'UNKNOWN', HARDCODED_ERR_VALUE_WITHIN_FUNCTION);
  })

  test("accountAddress (success)", async () => {
    const peerId = "0x"
    const resolvedState = { hoprAddress: peerId }
    const handler = jest.fn().mockReturnValue(resolvedState)
    const globalRef: any = global;
    const headers = {} as Headers
    globalRef.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ hoprAddress: peerId }) }));
    await accountAddress('localhost', {} as Headers)(handler)
    expect(handler).toHaveReturnedWith(resolvedState);
  })

  test("accountAddress (failed)", async () => {
    const error = "ACCOUNTADDRESS_REJECTED_ERROR"
    const resolvedState = { hoprAddress: undefined, error }
    const handler = jest.fn().mockReturnValue(resolvedState)
    const globalRef: any = global;
    const headers = {} as Headers
    globalRef.fetch = jest.fn(() => Promise.reject(error));
    await accountAddress('localhost', {} as Headers)(handler)
    expect(handler).toHaveReturnedWith(resolvedState);
  })
})
