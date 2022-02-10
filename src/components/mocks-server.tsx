import { useEffect, useState } from "react";
import { Box, Text, Button } from "grommet";
import styled from "styled-components";

const TextJustify = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CircleFill = styled.i`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  display: inline-block;
`;
export const MocksServer: React.FC<{ httpEndpoint: string, disabled?: boolean }> = ({ httpEndpoint, disabled }): JSX.Element => {
  const [isConnected, setConnected] = useState(false);
  useEffect(() => {
    (() =>
      httpEndpoint &&
      fetch(`${httpEndpoint}/mocks/status`)
        .then((res) => res.json())
        .then((data) => data?.status == "connected" && setConnected(true))
        .catch((err) => {
          console.error("ERROR Fetching from mock server", err);
          setConnected(false);
        }))();
  });

  const sendRandomMessage = () =>
    httpEndpoint &&
    fetch(`${httpEndpoint}/mocks/sendRandomMessage`, { method: "POST" });

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
      <Text alignSelf="center" textAlign="center" as="div">
        <TextJustify>
          Mocks Server
          {isConnected ? (
            <CircleFill style={{ backgroundColor: "#7AF5E7", marginLeft: 5 }} />
          ) : (
            <CircleFill style={{ backgroundColor: "#E04E0B", marginLeft: 5 }} />
          )}
        </TextJustify>
      </Text>
      {isConnected && (
        <Button
          disabled={disabled}
          onClick={sendRandomMessage}
          style={{ marginLeft: "10px" }}
          label="Random Msg"
        />
      )}
    </Box>
  );
};
