import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { formatEther } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
import { Box, Button, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { AddCircleOutlined, ContentCopyRounded } from "@mui/icons-material";

import { useGetSigner, useGetTotalBalance, useGetWallets } from "../../../hooks";
import { ShareIcon, MakeTransactionDialog, SideDrawer } from "../../index";
import { styles } from "./styles";

const Sidebar = () => {
  const router = useRouter();
  const { walletAddress, id: walletId }: any = router?.query;
  const { library } = useEthers();

  const signer = useGetSigner();
  const { walletList, refetch: getWallets } = useGetWallets(signer);
  const { balance, refetch: getTokenBalance } = useGetTotalBalance(signer, walletAddress);

  const [tooltipTitle, setTooltipTitle] = useState<string>("Copy to clipboard");

  useEffect(() => {
    getTokenBalance();
    getWallets();
  }, [router?.asPath]);

  return (
    <Box sx={styles.container}>
      <Stack direction="row" alignItems="center" justifyContent="center" p={2} spacing={0.5}>
        <IconButton sx={styles.addButton} size="small" onClick={() => router.push("/welcome")}>
          <AddCircleOutlined sx={{ fontSize: "36px" }} />
        </IconButton>
        <Typography variant="h6" sx={styles.addWalletText}>
          Add Wallet
        </Typography>
      </Stack>

      <Divider light />

      {router.route.includes("dashboard") && (
        <Stack p={2} spacing={1.75} alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Image
              src="/asset/images/walletAvatar.png"
              width="42"
              height="42"
              alt=""
              className="rounded-full object-cover"
            />
            <Box>
              <Typography variant="body2">
                <Typography variant="caption" fontWeight="bold">
                  {library?.network?.name?.substring(0, 2)}
                  {library?.network?.name?.substring(3, 4)}:
                </Typography>{" "}
                {walletAddress?.slice(0, 6)}
                ...{walletAddress?.slice(-4)}
              </Typography>

              <Typography variant="body2" color="primary.main" fontWeight="600">
                {balance ? balance : 0.0} USD
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" width="100%" px={1.5}>
            <Tooltip title={tooltipTitle} placement="top">
              <IconButton
                size="medium"
                sx={styles.iconButton}
                onClick={() => {
                  walletAddress && navigator.clipboard.writeText(walletAddress);
                  setTooltipTitle("Copied");
                  setTimeout(() => {
                    setTooltipTitle("Copy to clipboard");
                  }, 1200);
                }}
              >
                <ContentCopyRounded sx={styles.copyIcon} />
              </IconButton>
            </Tooltip>
            <Tooltip title="View on goerli.etherscan.io" placement="top">
              <IconButton
                size="small"
                sx={styles.iconButton}
                onClick={() => {
                  window.open(`https://${library?.network?.name}.etherscan.io/address/${walletAddress}`, "_blank");
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <Divider light sx={{ width: "100%" }} />

          {/* New Transaction */}
          <MakeTransactionDialog walletAddress={walletAddress}>
            <Button variant="outlined" sx={styles.actionsButton}>
              New Transaction
            </Button>
          </MakeTransactionDialog>

          {/* Dashboard */}
          <Button
            variant="outlined"
            sx={styles.actionsButton}
            onClick={() =>
              router.push({
                pathname: `/dashboard/${walletAddress}`,
                query: { id: walletId },
              })
            }
          >
            Dashboard
          </Button>

          {/* Assets */}
          <Button
            variant="outlined"
            sx={styles.actionsButton}
            onClick={() =>
              router.push({
                pathname: `/dashboard/${walletAddress}/assets`,
                query: { id: walletId },
              })
            }
          >
            Assets
          </Button>

          {/* Transactions */}
          <Button
            variant="outlined"
            sx={styles.actionsButton}
            onClick={() =>
              router.push({
                pathname: `/dashboard/${walletAddress}/transactions`,
                query: { id: walletId },
              })
            }
          >
            Transactions
          </Button>
        </Stack>
      )}

      <Divider light />
      {/* Sidebar Drawer */}
      <SideDrawer walletList={walletList} />
    </Box>
  );
};

export default Sidebar;
