import type { AppProps } from "next/app";
import Head from "next/head";
import { Grommet, Main } from "grommet";
import { createGlobalStyle } from "styled-components";
import { enableMapSet } from "immer";
import theme from "../src/theme";

// enables the use of Map and Set
// see https://immerjs.github.io/immer/installation/#pick-your-immer-version
enableMapSet();

const GlobalStyle = createGlobalStyle`
 @font-face {
    font-family: "Roboto";
    src: url("fonts/Roboto/Roboto-Regular.otf") format("opentype");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  /* load custom font */
  @font-face {
    font-family: "Roboto";
    src: url('fonts/Roboto/Roboto-MediumItalic.woff') format('woff'),
    font-weight: 400;
    font-style: italic;
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}

  /* custom scrollbar */
  /* our style can be fully supported by webkit only */
  ::-webkit-scrollbar {
    width: ${theme.global.edgeSize.medium};
  }
  ::-webkit-scrollbar-track {
    background: ${theme.global.colors["dark-3"]};
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.global.colors["light-1"]};
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.global.colors["light-1"]};
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
        <title>HOPR dApp | myne.chat</title>
      </Head>
      <GlobalStyle />
      <Main background="dark-2">
        <Component {...pageProps} />
      </Main>
    </Grommet>
  );
};

export default App;
