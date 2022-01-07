export const API = (endpoint: string, headers: Headers) => ({
  signRequest: async (encodedSignMessageRequest: string) => {
    return fetch(`${endpoint}/api/v2/sign`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        body: encodedSignMessageRequest,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.info("Returned response", data.signedMessage)
        return data.signedMessage;
      })
      .catch((err) => {
        console.error("ERROR requesting signature message", err);
        return String(err);
      });
  }
})