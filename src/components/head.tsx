import type { FunctionComponent } from "react";
import NextHead from "next/head";

const Head: FunctionComponent = () => {
  return (
    <NextHead>
      <title>MYNE Chat</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="MYNE Chat description" />
    </NextHead>
  );
};

export default Head;
