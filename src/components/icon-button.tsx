import styled from "styled-components";
import { Box } from "grommet";
import { normalizeColor } from "grommet/utils";

const IconButton = styled(Box)`
  display: inline-block;
  cursor: pointer;
  max-height: min-content;
  max-width: min-content;

  color: ${(props) => normalizeColor("light-1", props.theme)};
  svg {
    stroke: ${(props) => normalizeColor("light-1", props.theme)};
  }

  &:hover {
    background: ${(props) => normalizeColor("dark-4", props.theme)};
  }

  &:active {
    color: ${(props) => normalizeColor("dark-1", props.theme)};
    svg {
      stroke: ${(props) => normalizeColor("dark-1", props.theme)};
    }
    background: ${(props) => normalizeColor("light-1", props.theme)};
  }
`;

export default IconButton;
