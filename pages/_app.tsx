import type { AppProps } from "next/app";
import { Grommet } from "grommet";
import theme from "../src/theme";
import Head from "../src/components/head";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Grommet full theme={theme}>
      <Head />
      <main>
        <Component {...pageProps} />
      </main>
    </Grommet>
  );
};

export default App;
