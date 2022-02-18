import type { FunctionComponent } from "react";
import Image from "next/image";
import { Box, Anchor } from "grommet";

const Logo: FunctionComponent<{
  isOnline?: boolean;
}> = ({ isOnline }) => {
  const faded = !isOnline;

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
        <Image
          src="/myne-chat-logo.svg"
          alt="Myne Chat Logo"
          layout="responsive"
          width="250px"
          height="125px"
        />
      </Box>
      <Anchor
        href="https://hoprnet.org"
        target="_blank"
        label="Privacy powered by HOPR"
        alignSelf="end"
        style={{ textDecoration: "none", fontSize: 10, textAlign: "right" }}
      />
    </Box>
  );
};

export default Logo;
