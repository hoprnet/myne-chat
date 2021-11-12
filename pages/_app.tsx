import type { AppProps } from "next/app";
import { Grommet, Main } from "grommet";
import { createGlobalStyle } from "styled-components";
import theme from "../src/theme";
import Head from "../src/components/head";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: GerstnerProgrammFSL;
    src: url("fonts/GerstnerProgrammFSL/GerstnerProgrammFSL-Regular.otf") format("opentype");
    font-weight: normal;
    font-style: normal;
  }
`;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Grommet full theme={theme}>
      <Head />
      <GlobalStyle />
      <Main background="dark-2">
        <Component {...pageProps} />
      </Main>
    </Grommet>
  );
};

export default App;
