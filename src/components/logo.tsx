import type { FunctionComponent } from "react";
import type { ConnectionStatus } from "../state";
import LogoSVG from '../../public/myne-chat-logo.svg'
import { Box, Anchor } from "grommet";

const Logo: FunctionComponent<{
  status?: ConnectionStatus;
}> = ({ status }) => {
  const faded = status === "DISCONNECTED";

  return (
    <Box
      style={{
        opacity: faded ? "0.5" : 1,
      }}
    >
      <Box
        width={{
          max: "250px",
        }}
        height={{
          max: "125px",
        }}
      >
        <img
          src={LogoSVG.src}
          alt="Myne Chat Logo"
          width="250px"
          height="125px"
        />
      </Box>
      <Anchor
        href="https://hoprnet.org"
        target="_blank"
        label="Privacy powered by HOPR"
        alignSelf="end"
      />
    </Box>
  );
};

export default Logo;
