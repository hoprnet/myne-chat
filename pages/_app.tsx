import type { AppProps } from "next/app";
import Head from "next/head";
import { Grommet, Main } from "grommet";
import { createGlobalStyle } from "styled-components";
import theme from "../src/theme";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: GerstnerProgrammFSL;
    src: url("fonts/GerstnerProgrammFSL/GerstnerProgrammFSL-Regular.otf") format("opentype");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Grommet full theme={theme}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* TODO: add more icons */}
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content="Changing messaging privacy for good."
        />
        <title>MYNE Chat</title>
      </Head>
      <GlobalStyle />
      <Main background="dark-2">
        <Component {...pageProps} />
      </Main>
    </Grommet>
  );
};

export default App;
