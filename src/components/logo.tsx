import type { FunctionComponent } from "react";
import Image from "next/image";
import { Box, Text } from "grommet";
import { useTheme } from "../theme";

const Logo: FunctionComponent = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box>
        <Image
          src="/myne-chat-logo.svg"
          alt="Myne Chat Logo"
          width="500"
          height="250"
          layout="responsive"
        />
      </Box>
      <Box
        pad={{
          horizontal: theme.global.raw.space.medium,
        }}
      >
        <Text textAlign="end">Privacy powered by HOPR</Text>
      </Box>
    </Box>
  );
};

export default Logo;
