import { Chip, Paper, Typography } from "@mui/material";
import { useEthers } from "@usedapp/core";
import React from "react";
import { styles } from "./styles";

const ConnectWallet = () => {
  const { library } = useEthers();

  return (
    <Paper sx={styles.container}>
      <Typography variant="body1" gutterBottom>
        Wallet Connected.
      </Typography>
      <Typography variant="body1" component="span" gutterBottom>
        Creating a Wallet on{" "}
      </Typography>
      <Chip label={library?.network?.name} sx={styles.chip} />
    </Paper>
  );
};

export default ConnectWallet;
