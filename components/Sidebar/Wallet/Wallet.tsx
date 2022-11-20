import {
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEthers } from "@usedapp/core";
import { useRouter } from "next/router";
import React from "react";
import { useGetWalletName } from "../../../hooks";

type Props = {
  wallet: string;
  walletId: number;
};

const Wallet: React.FC<Props> = ({ wallet, walletId }) => {
  const router = useRouter();
  const { walletAddress } = router?.query;

  const { account, library } = useEthers();
  const walletName = useGetWalletName([account?.toString(), +walletId]);
  return (
    <ListItem disablePadding>
      <ListItemButton
        sx={{
          backgroundColor: wallet === walletAddress ? "grey.300" : "",
          py: "10px",
          px: 4,
        }}
        onClick={() =>
          router.push({
            pathname: `/dashboard/${wallet}`,
            query: { id: walletId },
          })
        }
      >
        <ListItemAvatar>
          <Avatar
            src="/asset/images/walletAvatar.png"
            sx={{ width: 38, height: 38 }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Typography variant="body2" fontWeight="600">
                {walletName}
              </Typography>
              <Typography variant="body2">
                <Typography variant="body2" component="span" fontWeight="bold">
                  {library?.network?.name?.substring(0, 2)}
                  {library?.network?.name?.substring(3, 4)}:
                </Typography>{" "}
                {wallet?.slice(0, 6)}
                ...{wallet?.slice(-4)}
              </Typography>
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default Wallet;
