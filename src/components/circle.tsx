import styled from "styled-components";
import { normalizeColor } from "grommet/utils";

const Circle = styled.div<{ size: string; color: string }>`
  display: inline-flex;
  border-radius: 50%;
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  background-color: ${(props) => normalizeColor(props.color, props.theme)};
`;

export default Circle;
