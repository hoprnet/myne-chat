export const API = (endpoint: string, headers: Headers) => ({
  signRequest: async (encodedSignMessageRequest: string) => {
    return fetch(`${endpoint}/api/v2/message/sign`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: encodedSignMessageRequest,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.info("Returned response", data.signature)
        return data.signature;
      })
      .catch((err) => {
        console.error("ERROR requesting signature message", err);
        return String(err);
      });
  }
})