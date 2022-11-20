import React, { useEffect, useState } from "react";
import { useEthers } from "@usedapp/core";
import { Paper, Typography, Chip, TextField, Box } from "@mui/material";
import { styles } from "./styles";

const NameOfWallet = () => {
  const { library } = useEthers();
  const [walletName, setWalletName] = useState(() => {
    const walletName = sessionStorage.getItem("walletName");
    return walletName ? JSON.parse(walletName) : "";
  });

  useEffect(() => {
    return () =>
      sessionStorage.setItem("walletName", JSON.stringify(walletName));
  }, [walletName]);

  return (
    <Paper sx={styles.container}>
      <Box>
        <Typography variant="subtitle1" component="span" gutterBottom>
          You are about to create a new wallet with one or more owners. First,
          let&apos;s give your new wallet a name. This name is only stored on
          the blockchain and will never be shared with us or any third parties.
          The new Wallet will ONLY be available on{" "}
        </Typography>
        <Chip label={library?.network?.name} sx={styles.chip} />
      </Box>

      <Box>
        <Typography variant="body2" component="p" my={1.8}>
          Name of the new wallet
        </Typography>
        <TextField
          label="Wallet Name"
          sx={{ width: "25ch" }}
          color="error"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          placeholder="Enter wallet name"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
        />
      </Box>
    </Paper>
  );
};

export default NameOfWallet;
