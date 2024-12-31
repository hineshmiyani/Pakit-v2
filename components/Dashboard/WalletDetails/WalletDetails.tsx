import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

import { Box, Button, Card, CardContent, Chip, Paper, Stack, Typography } from "@mui/material";
import { useEthers } from "@usedapp/core";

import { useGetSigner, useGetTotalBalance } from "../../../hooks";
import { MakeTransactionDialog } from "../../index";
import { styles } from "./styles";

const WalletDetails = () => {
  const router = useRouter();
  const { walletAddress } = router?.query;

  const { library } = useEthers();
  const signer = useGetSigner();
  const { balance } = useGetTotalBalance(signer, walletAddress);

  return (
    <>
      <Typography variant="h5" fontWeight="bold" my="24px">
        Dashboard
      </Typography>
      <Paper elevation={0} sx={styles.container}>
        <Card sx={styles.cardContainer}>
          <CardContent sx={styles.cardContent}>
            <Image
              src="/asset/images/walletAvatar.png"
              width="48"
              height="48"
              alt=""
              className="rounded-full object-cover"
            />
            {/* <Typography variant="body1" fontWeight="bold" mt={1.5} gutterBottom>
              {walletName}
            </Typography>{" "} */}
            <Typography variant="body1">
              <Typography variant="body1" component="span" fontWeight="bold">
                {library?.network?.name?.substring(0, 3)}:
              </Typography>{" "}
              {walletAddress}
            </Typography>
            <Chip label={library?.network?.name} sx={styles.chip} />
            <Stack alignItems="center" direction="row" mt={1.5}>
              <Box>
                <Typography variant="body1" color="primary.main" fontSize="14px">
                  Total Balance
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {balance ? balance : 0.0} USD
                </Typography>
              </Box>

              <Box ml="auto">
                {walletAddress && !Array.isArray(walletAddress) && (
                  <MakeTransactionDialog walletAddress={walletAddress}>
                    <Button sx={styles.transactionButton}>New Transaction</Button>
                  </MakeTransactionDialog>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
};

export default WalletDetails;
