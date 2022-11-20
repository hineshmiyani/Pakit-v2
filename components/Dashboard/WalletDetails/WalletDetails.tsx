import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import {
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Stack,
  Box,
  Button,
} from "@mui/material";
import MakeTransectionDialog from "../../Sidebar/MakeTransactionDialog/MakeTransactionDialog";
import { useGetWalletName } from "../../../hooks";
import { styles } from "./styles";

const WalletDetails = () => {
  const router = useRouter();
  const { walletAddress }: any = router?.query;
  const { id: walletId } = router?.query;

  const { account, library } = useEthers();
  const walletName = useGetWalletName([
    account?.toString(),
    walletId && +walletId,
  ]);
  const etherBalance = useEtherBalance(walletAddress);

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
            <Typography variant="body1" fontWeight="bold" mt={1.5} gutterBottom>
              {walletName}
            </Typography>{" "}
            <Typography variant="body1">
              <Typography variant="body1" component="span" fontWeight="bold">
                {library?.network?.name?.substring(0, 2)}
                {library?.network?.name?.substring(3, 4)}:
              </Typography>{" "}
              {walletAddress}
            </Typography>
            <Chip label={library?.network?.name} sx={styles.chip} />
            <Stack alignItems="center" direction="row" mt={1.5}>
              <Box>
                <Typography
                  variant="body1"
                  color="primary.main"
                  fontSize="14px"
                >
                  Total Balance
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {etherBalance ? formatEther(etherBalance) : 0.0} ETH
                </Typography>
              </Box>

              <Box ml="auto">
                <MakeTransectionDialog walletAddress={walletAddress}>
                  <Button sx={styles.transactionButton}>New Transaction</Button>
                </MakeTransectionDialog>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
};

export default WalletDetails;
