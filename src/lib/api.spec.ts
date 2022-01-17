import { API } from './api'

describe('API', () => {
  test("signRequest", async () => {
    const signature = "0x304402201065a95fd22fc3e48266c3b270ace032489b0177e07d33c59e0d13dccc89108402205f41fb911bcfe485a8e58162ebce90382dc96ccafff378e5c8960e07efcf9e92"
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ signature }),
      })
    );
    expect(
      await API('localhost', {} as Headers)
      .signRequest("myne:sign:empty:empty")
    ).toEqual(signature)
  })

  test("sendMessage (success)", async () => {
    const handler = jest.fn().mockResolvedValue(true)
    const destination = "destination"
    const id = "0"
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() => Promise.resolve({ status: 204 }));
    await API('localhost', {} as Headers).sendMessage("0x", "message", destination, id, handler)
    expect(handler).toHaveBeenCalledWith(destination, id, 'SUCCESS');
  })

  test("sendMessage (failure)", async () => {
    const handler = jest.fn().mockResolvedValue(true)
    const destination = "destination"
    const error = 'FATAL_ERROR'
    const id = "0"
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() => Promise.resolve({ status: 422, json: () => Promise.resolve({ error }) }));
    await API('localhost', {} as Headers).sendMessage("0x", "message", destination, id, handler)
    expect(handler).toHaveBeenCalledWith(destination, id, 'FAILURE', error);
  })
})
