import React, { useState } from "react";
import Image from "next/image";
import { useEthers } from "@usedapp/core";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowDown,
  ContentCopyRounded,
  AccountBalanceWalletOutlined,
} from "@mui/icons-material";
import { ShareIcon } from "../index";
import { styles } from "./styles";

const AccountDialog = () => {
  const { library, deactivate, account } = useEthers();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tooltipTitle, setTooltipTitle] = useState<string>("Copy to clipboard");

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="circle"
        size="small"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <KeyboardArrowDown sx={{ color: "primary.main" }} />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          style: styles.menuContainer,
        }}
      >
        <Stack py={1} px={2} spacing={1} alignItems="center">
          <Image
            src="/asset/images/avatar.png"
            width="60"
            height="60"
            alt=""
            className="rounded-full object-cover"
          />
          <Stack direction="row" spacing={0.5} sx={styles.addressContainer}>
            <Typography variant="body1" className="text-xs truncate">
              <Typography variant="caption" fontWeight="bold">
                {library?.network?.name?.substring(0, 2)}
                {library?.network?.name?.substring(3, 4)}:
              </Typography>{" "}
              {account?.slice(0, 6)}
              ...{account?.slice(-4)}
            </Typography>

            <Tooltip title={tooltipTitle} placement="top">
              <IconButton
                size="medium"
                onClick={() => {
                  account && navigator.clipboard.writeText(account);
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
                onClick={() => {
                  window.open(
                    `https://${library?.network?.name}.etherscan.io/address/${account}`,
                    "_blank"
                  );
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Divider />

        <Stack
          py={0.8}
          px={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="caption">Wallet</Typography>
          <Box display="flex" gap="5px">
            <AccountBalanceWalletOutlined
              fontSize="small"
              sx={styles.walletIcon}
            />
            <Typography variant="caption">
              {library?.connection?.url?.[0]?.toUpperCase() +
                "" +
                library?.connection?.url?.substring(1)}
            </Typography>
          </Box>
        </Stack>

        <Divider />

        <Stack
          py={0.8}
          px={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="caption">Connected Network</Typography>
          <Box>
            <Typography variant="caption">
              {library?.network?.name?.substring(0, 1)?.toUpperCase() +
                "" +
                library?.network?.name?.substring(1)}
            </Typography>
          </Box>
        </Stack>

        <Divider />

        <Box sx={{ m: "20px 20px 12px" }}>
          <Button
            sx={styles.disconnectButton}
            onClick={() => {
              handleClose();
              deactivate();
            }}
          >
            Disconnect
          </Button>
        </Box>
      </Menu>
    </div>
  );
};

export default AccountDialog;
