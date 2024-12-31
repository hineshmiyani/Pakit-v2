import { Button, Container, Stack, Typography } from "@mui/material";
import { useEthers } from "@usedapp/core";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
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
    <Container maxWidth={false} sx={styles.container}>
      <Stack alignItems="center" spacing={2}>
        <Image src="/asset/images/pakitLogo.png" height={160} width={160} alt="Pakit Logo" />
        <Typography variant="h3" fontWeight="bold" sx={styles.text}>
          Open your Pakit
        </Typography>
        <Typography variant="h6" sx={styles.text} gutterBottom>
          Get Started by Logging in with your Metamask Wallet.
        </Typography>
        <Button variant="contained" size="large" sx={styles.button} onClick={() => activateBrowserWallet()}>
          Login with Metamask
        </Button>
      </Stack>
    </Container>
  );
};

export default Login;
