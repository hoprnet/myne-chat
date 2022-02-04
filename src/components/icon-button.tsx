import type { FunctionComponent } from "react";
import styled from "styled-components";
import { Box, Button } from "grommet";
import { normalizeColor } from "grommet/utils";

const StyledButton = styled(Button)`
  cursor: ${(props) => !props.disabled && 'pointer'};
`

const StyledBox = styled(Box)`
  display: inline-flex;
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

// TODO: add types
const IconButton: FunctionComponent<any> = (props) => {
  return (
    <StyledButton {...props}>
      <StyledBox
        pad="small"
        alignSelf="end"
        round
        flex
        margin={{ left: "small" }}
      >
        {props.children}
      </StyledBox>
    </StyledButton>
  );
};

export default IconButton;
