import { Box, TextInput } from "grommet"
import { ChangeEvent, useEffect, useReducer, useState } from "react"
import { MocksHandler } from "./mocks-handler"
import { MocksServer } from "./mocks-server"

export const MocksDemo: React.FC<{ defaulTransformer: string }> = ({defaulTransformer = "(msg) => `This is the default transformer ${msg}`"}): JSX.Element => {
  const [httpEndpoint, setHttpEndpoint] = useState("http://localhost:3001")
  const [wsEndpoint, setWsEndpoint] = useState("ws://localhost:3000")
  const [transformer, setTransformer] = useState(defaulTransformer)

  return (
    <>
      <Box>
        HTTP endpoint:
        <TextInput
          placeholder={httpEndpoint}
          value={httpEndpoint}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setHttpEndpoint(e.target.value)}
        />
      </Box>
      <Box>
        WS endpoint:
        <TextInput
          placeholder={wsEndpoint}
          value={wsEndpoint}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setWsEndpoint(e.target.value)}
        />
      </Box>
      <Box>
        Transformer
        <TextInput
          disabled
          placeholder={transformer}
          value={transformer}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTransformer(e.target.value)}
        />
      </Box>
      <Box>
        <MocksServer httpEndpoint={httpEndpoint} />
      </Box>
      <Box>
        <MocksHandler httpEndpoint={httpEndpoint} wsEndpoint={wsEndpoint} transform={eval(transformer)}></MocksHandler>
      </Box>
    </>
  )
}