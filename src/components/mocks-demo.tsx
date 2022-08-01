import { Box, TextInput } from "grommet"
import { ChangeEvent, useEffect, useReducer, useState } from "react"
import { MocksHandler } from "./mocks-handler"
import { MocksServer } from "./mocks-server"

export const MocksDemo: React.FC<{ defaulTransformer: string }> = ({defaulTransformer = "(msg) => `This is the default transformer ${msg}`"}): JSX.Element => {
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:3001")
  const [transformer, setTransformer] = useState(defaulTransformer)

  return (
    <>
      <Box>
        API endpoint:
        <TextInput
          placeholder={apiEndpoint}
          value={apiEndpoint}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setApiEndpoint(e.target.value)}
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
        <MocksServer apiEndpoint={apiEndpoint} />
      </Box>
      <Box>
        <MocksHandler apiEndpoint={apiEndpoint} transform={eval(transformer)}></MocksHandler>
      </Box>
    </>
  )
}
