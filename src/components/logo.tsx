import type { FunctionComponent } from "react";
import Image from "next/image";
import { Box, Text } from "grommet";

const Logo: FunctionComponent = () => {
  return (
    <Box>
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
      <Box
        pad={{
          horizontal: "medium",
        }}
      >
        <Text>Privacy powered by HOPR</Text>
      </Box>
    </Box>
  );
};

export default Logo;
