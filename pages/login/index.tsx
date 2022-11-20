import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEthers } from "@usedapp/core";
import { Button, Container, Stack, Typography } from "@mui/material";
import { styles } from "./styles";

const Login = () => {
  const { activateBrowserWallet, account } = useEthers();
  const router = useRouter();
  const { redirect_url } = router.query;

  useEffect(() => {
    if (account) {
      if (redirect_url && !redirect_url.includes("login")) {
        router.push(`${redirect_url}`);
      } else {
        router.push("/welcome");
      }
    }
  }, [account, redirect_url, router]);

  return (
    <>
      <Container maxWidth={false} sx={styles.container}>
        <Stack alignItems="center">
          <Image
            src="/asset/images/pakitLogo.png"
            height={160}
            width={160}
            className="object-cover"
            alt=""
          />
          <Typography variant="h1" fontWeight="bold" mb="14px" sx={styles.text}>
            Open your Pakit
          </Typography>
          <Typography variant="h6" gutterBottom sx={styles.text}>
            Get Started by Logging in with your Metamask Wallet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={styles.button}
            onClick={() => activateBrowserWallet()}
          >
            Login with Metamask
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default Login;
