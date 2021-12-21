import { Box } from 'grommet'
import parse from 'html-react-parser'
import { FunctionComponent } from 'react'

const Help: FunctionComponent<{ readmeInHTML: string }> = ({ readmeInHTML }) => (
  <Box
    height="100%"
    direction="column-reverse"
    overflow={{
      vertical: "auto",
      horizontal: "hidden",
    }}
  >
    <Box justify="center" height="100%">{parse(readmeInHTML)}</Box>
  </Box>
)


export default Help