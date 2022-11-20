import React from "react";
import { useRouter } from "next/router";
import { AddCircleOutlined } from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Wallet from "../Wallet/Wallet";
import { styles } from "./styles";

type Props = {
  walletList: string[];
};
type Anchor = "left";
const SideDrawer: React.FC<Props> = ({ walletList }) => {
  const router = useRouter();
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      width="350px"
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Stack
          direction="row"
          alignItems="center"
          px={3}
          py={0.5}
          spacing={1.2}
        >
          <IconButton
            sx={styles.addButton}
            size="small"
            onClick={() => router.push("/welcome")}
          >
            <AddCircleOutlined sx={styles.addIcon} />
          </IconButton>
          <Typography variant="h6" sx={styles.addWalletText}>
            Add Wallet
          </Typography>
        </Stack>
      </List>
      <Divider />
      <List sx={{ p: 0 }}>
        <ListItem disablePadding>
          <ListItemButton sx={styles.listButton}>
            <ListItemText
              primary={
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1" fontWeight="600">
                    Total Wallet :
                  </Typography>
                  <Typography variant="body1" component="span" fontWeight="600">
                    {walletList.length}
                  </Typography>{" "}
                </Stack>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        {walletList.map((wallet, index) => (
          <Wallet key={wallet} wallet={wallet} walletId={index} />
        ))}

        {walletList.length === 0 && (
          <ListItem disablePadding>
            <ListItemText
              sx={styles.listText}
              primary={
                <>
                  <Typography variant="body1" gutterBottom>
                    Wallet not found!
                  </Typography>
                  <Typography variant="body1" component="span">
                    Please create new wallet.
                  </Typography>
                </>
              }
            />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box p={2} textAlign="center">
      {(["left"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            sx={styles.actionsButton}
            onClick={toggleDrawer(anchor, true)}
          >
            Select Wallet
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default SideDrawer;
