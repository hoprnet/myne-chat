import { UpdateMessageHandlerInterface } from "../state/conversations";

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
  },
  sendMessage: async (recipient: string, body: string, destination: string, id: string, updateMessage: UpdateMessageHandlerInterface) => {
    return fetch(`${endpoint}/api/v2/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      recipient,
      body,
    }),
  })
    .then(async (res) => {
      if (res.status === 204) return updateMessage(destination, id, "SUCCESS");
      if (res.status === 422) return updateMessage(destination, id, "FAILURE", (await res.json()).error)
      // If we didn't get a supported status response code, we return unknown
      const err = 'Unknown response status.'
      console.error("ERROR sending message", err);
      return updateMessage(destination, id, "UNKNOWN", err)
    })
    .catch((err) => {
      console.error("ERROR sending message", err);
      updateMessage(destination, id, "FAILURE", String(err));
    });
  }
})