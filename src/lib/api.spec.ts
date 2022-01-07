import { API } from './api'

describe('API', () => {
  test("signRequest", async () => {
    const signedMessage = "0x304402201065a95fd22fc3e48266c3b270ace032489b0177e07d33c59e0d13dccc89108402205f41fb911bcfe485a8e58162ebce90382dc96ccafff378e5c8960e07efcf9e92"
    const globalRef: any = global;
    globalRef.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ signedMessage }),
      })
    );
    expect(await API('localhost', {} as Headers).signRequest("myne:sign:empty:empty")).toEqual(signedMessage)
  })
})
