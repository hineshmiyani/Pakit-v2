import type { AppProps } from "next/app";

import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { Config, DAppProvider, Sepolia } from "@usedapp/core";
import { getDefaultProvider } from "ethers";
import { Toaster } from "react-hot-toast";

import { Layout } from "../components";
import "../styles/globals.css";
import { theme } from "../theme";

const config: Config = {
  readOnlyChainId: Sepolia.chainId,
  readOnlyUrls: {
    // [Mainnet.chainId]: getDefaultProvider("mainnet"),
    [Sepolia.chainId]: getDefaultProvider("sepolia") || process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "",
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <DAppProvider config={config}>
          <Layout>
            <>
              <Component {...pageProps} />
              <Toaster
                toastOptions={{
                  style: {
                    maxWidth: "1000px",
                    width: "auto",
                    overflow: "hidden",
                  },
                }}
              />
            </>
          </Layout>
        </DAppProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default MyApp;
