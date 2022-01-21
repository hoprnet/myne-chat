import { Box, Text, Button } from "grommet"
import { useEffect, useState } from "react"

export const MocksServer: React.FC<{ httpEndpoint: string }> = ({ httpEndpoint }): JSX.Element => {
  const [isConnected, setConnected] = useState(false)
  useEffect(() => {
    (() =>
      httpEndpoint && fetch(`${httpEndpoint}/mocks/status`)
        .then(res => res.json())
        .then(data => data?.status == 'connected' && setConnected(true))
        .catch(err => { console.error('ERROR Fetching from mock server', err); setConnected(false); })
    )()
  })

  const sendRandomMessage = () => httpEndpoint && fetch(`${httpEndpoint}/mocks/sendRandomMessage`, { method: 'POST'});

  return (
    <Box
      direction="row"
      justify="start"
      align="center"
      height={{
        min: "min-content",
        height: "100px",
      }}
    >
      <Text>Mocks Server { isConnected ? '🟢' : '🔴' }</Text>
      { isConnected && <Button onClick={sendRandomMessage} style={{ marginLeft: "10px" }} label="Random Msg" />}
    </Box>
  )
}