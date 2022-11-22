import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useEthers } from "@usedapp/core";
import { Container } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { useGetSigner, useGetWallets, useIsOwner } from "../../hooks";
import { Header, Sidebar } from "../index";
import { styles } from "./styles";

type Props = {
  children: JSX.Element;
};

const Layout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { walletAddress, id: walletId } = router.query;

  const { account } = useEthers();

  const signer = useGetSigner();
  const walletList = useGetWallets(signer);
  const isOwner = useIsOwner(signer, walletAddress);

  useEffect(() => {
    //* When Metamask is not connected
    if (!account && router?.isReady) {
      if (router?.route?.includes("dashboard")) {
        router.push({
          pathname: "/login",
          query: { redirect_url: "/welcome" },
        });
      } else {
        router.push({
          pathname: "/login",
          query: { redirect_url: router?.pathname },
        });
      }
    }

    //* When Metamask is connected
    if (account && router?.isReady) {
      setTimeout(() => {
        const walletIndex = typeof walletAddress === "string" && walletList.indexOf(walletAddress);
        if (isOwner === true && walletId) {
          console.log({ walletIndex, walletId });
          walletIndex != +walletId &&
            router.push({
              pathname: `/dashboard/${walletAddress}`,
              query: { id: walletIndex >= 0 ? walletIndex : 0 },
            });
        } else if (isOwner === false) {
          router.push("/welcome");
        }
      }, 2000);
    }
  }, [account, isOwner]);

  // Render login page
  if (router?.route?.includes("login")) {
    return <>{children}</>;
  }

  // Render other pages except login page
  return (
    <>
      {/* Header */}
      <Header />

      {/* Main */}
      <Container maxWidth={false} sx={styles.container}>
        <Grid container>
          {/* Sidebar */}
          <Grid xs={2}>
            <Sidebar />
          </Grid>
          {/* Main Ctn */}
          <Grid xs={10} sx={{ py: 3 }}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Layout;
