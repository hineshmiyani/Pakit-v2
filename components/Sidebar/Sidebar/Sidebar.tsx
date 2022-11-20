import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { formatEther } from "@ethersproject/units";
import { useEtherBalance, useEthers } from "@usedapp/core";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { AddCircleOutlined, ContentCopyRounded } from "@mui/icons-material";
import {
  useGetWalletName,
  useGetWallets,
  useGetWalletsCount,
} from "../../../hooks";
import { ShareIcon } from "../../index";

import MakeTransactionDialog from "../MakeTransactionDialog/MakeTransactionDialog";
import SideDrawer from "../SideDrawer/SideDrawer";
import { styles } from "./styles";

const Sidebar = () => {
  const router = useRouter();
  const { id: walletId }: any = router?.query;
  const { account, library } = useEthers();
  const [tooltipTitle, setTooltipTitle] = useState<string>("Copy to clipboard");

  const walletName = useGetWalletName([account?.toString(), +walletId]);
  const totalWallet = useGetWalletsCount([account?.toString()]);
  const walletList = useGetWallets(
    [account?.toString()],
    parseInt(totalWallet)
  );

  const etherBalance = useEtherBalance(walletList?.[+walletId]);

  return (
    <Box sx={styles.container}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        p={2}
        spacing={0.5}
      >
        <IconButton
          sx={styles.addButton}
          size="small"
          onClick={() => router.push("/welcome")}
        >
          <AddCircleOutlined sx={{ fontSize: "36px" }} />
        </IconButton>
        <Typography variant="h6" sx={styles.addWalletText}>
          Add Wallet
        </Typography>
      </Stack>

      <Divider light />

      {router.route.includes("dashboard") &&
        walletId &&
        [walletList?.[+walletId]]?.map((wallet: "string") => (
          <Box key={wallet}>
            <Stack p={2} spacing={1.75} alignItems="center">
              <Image
                src="/asset/images/walletAvatar.png"
                width="48"
                height="48"
                alt=""
                className="rounded-full object-cover"
              />
              <Box>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  textAlign="center"
                  gutterBottom
                >
                  {walletName}
                </Typography>
                <Typography variant="body2">
                  <Typography variant="caption" fontWeight="bold">
                    {library?.network?.name?.substring(0, 2)}
                    {library?.network?.name?.substring(3, 4)}:
                  </Typography>{" "}
                  {wallet?.slice(0, 6)}
                  ...{wallet?.slice(-4)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title={tooltipTitle} placement="top">
                  <IconButton
                    size="medium"
                    sx={styles.iconButton}
                    onClick={() => {
                      wallet && navigator.clipboard.writeText(wallet);
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
                      window.open(
                        `https://${library?.network?.name}.etherscan.io/address/${wallet}`,
                        "_blank"
                      );
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack alignItems="center">
                <Typography variant="body1" sx={styles.balanceText}>
                  Total Balance
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {etherBalance ? formatEther(etherBalance) : 0.0} ETH
                </Typography>
              </Stack>

              {/* New Transaction */}
              <MakeTransactionDialog walletAddress={wallet}>
                <Button sx={styles.actionsButton}>New Transaction</Button>
              </MakeTransactionDialog>

              {/* Dashboard */}
              <Button
                sx={styles.actionsButton}
                onClick={() =>
                  router.push({
                    pathname: `/dashboard/${wallet}`,
                    query: { id: walletId },
                  })
                }
              >
                Dashboard
              </Button>

              {/* Transactions */}
              <Button
                sx={styles.actionsButton}
                onClick={() =>
                  router.push({
                    pathname: `/dashboard/${wallet}/transactions`,
                    query: { id: walletId },
                  })
                }
              >
                Transactions
              </Button>
            </Stack>
          </Box>
        ))}

      <Divider light />
      <SideDrawer walletList={walletList} />
    </Box>
  );
};

export default Sidebar;
