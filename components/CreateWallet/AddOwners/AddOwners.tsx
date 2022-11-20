import React, { useEffect, useState } from "react";
import { useEthers } from "@usedapp/core";
import {
  Paper,
  Box,
  Typography,
  Chip,
  TextField,
  Divider,
  Stack,
  Button,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import { Add, DeleteOutline } from "@mui/icons-material";
import { styles } from "./styles";

const AddOwners = () => {
  const { library, account } = useEthers();
  const [ownerCount, setOwnerCount] = useState<number>(() => {
    if (sessionStorage.getItem("ownersData")) {
      const { ownersList } = JSON.parse(
        sessionStorage.getItem("ownersData") || ""
      );
      return ownersList.length;
    }
    return 1;
  });
  const [ownersList, setOwnersList] = useState<any[]>(() => {
    const ownersData = sessionStorage.getItem("ownersData");
    if (ownersData) {
      const { ownersList } = JSON.parse(ownersData || "");
      return ownersList.length > 0 && ownersList[0] !== ""
        ? ownersList
        : [account];
    }
    return [account];
  });

  const [requiredConfirmations, setRequiredConfirmations] = useState<string>(
    () => {
      const ownersData = sessionStorage.getItem("ownersData");
      return ownersData
        ? JSON.parse(ownersData || "")?.requiredConfirmations
        : "1";
    }
  );

  const handleChange = (event: SelectChangeEvent) => {
    setRequiredConfirmations(event.target.value.toString());
  };

  useEffect(() => {
    const newOwnersList = ownersList.filter((val) => val !== "");
    return () => {
      sessionStorage.setItem(
        "ownersData",
        JSON.stringify({
          ownersList: newOwnersList,
          requiredConfirmations,
        })
      );
    };
  }, [ownersList, requiredConfirmations]);

  const handleOwnersList = (e: any, index: any) => {
    setOwnersList((prevOwnersList) => {
      let newList = [...prevOwnersList];
      newList[index] = e.target.value;
      return newList;
    });
  };

  return (
    <Paper sx={styles.container}>
      <Box px={3}>
        <Typography variant="subtitle1" mb={2}>
          Your Wallet will have one or more owners. We have prefilled the first
          owner with your connected wallet details, but you are free to change
          this to a different owner.
        </Typography>
        <Typography variant="subtitle1" mb={2}>
          Add additional owners (e.g. wallets of your teammates) and specify how
          many of them have to confirm a transaction before it gets executed. In
          general, the more confirmations required, the more secure your Wallet
          is.
        </Typography>
        <Box mb={4}>
          <Typography variant="subtitle1" component="span">
            The new Safe will ONLY be available on{" "}
          </Typography>
          <Chip label={library?.network?.name} sx={styles.chip} />
        </Box>
      </Box>

      <Divider />

      <Stack direction="row" px={3}>
        <Typography variant="body2" my={1} maxWidth="26%" flexBasis="26%">
          Name
        </Typography>
        <Typography variant="body2" my={1} maxWidth="58%" flexBasis="58%">
          Address
        </Typography>
      </Stack>

      <Divider />

      <Box p={3} textAlign="center">
        {Array(ownerCount)
          .fill("")
          .map((val: string, index: number) => (
            <Stack direction="row" key={index} mb={2.5} alignItems="center">
              <Typography
                variant="body1"
                my={1}
                maxWidth="22.9%"
                flexBasis="22.9%"
                textAlign="left"
              >
                Owner {index + 1}
              </Typography>
              <TextField
                label="Owner Address"
                color="error"
                variant="outlined"
                required
                sx={styles.addressInput}
                placeholder="Owner Address*"
                InputLabelProps={{ shrink: true }}
                value={ownersList[index]}
                onChange={(e) => handleOwnersList(e, index)}
              />
              {index !== 0 && (
                <Tooltip title="Delete" placement="top">
                  <IconButton
                    aria-label="delete"
                    size="medium"
                    sx={{ ml: 1 }}
                    onClick={() => {
                      setOwnerCount((prevOwnerCount) => prevOwnerCount - 1);
                      setOwnersList((prevOwnersList) =>
                        prevOwnersList.filter(
                          (owner, ownerIndex) => ownerIndex !== index
                        )
                      );
                    }}
                  >
                    <DeleteOutline fontSize="medium" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          ))}
        <Button
          variant="text"
          sx={styles.addOwnerButton}
          startIcon={<Add />}
          onClick={() => setOwnerCount((prevOwnerCount) => prevOwnerCount + 1)}
        >
          Add another Owner
        </Button>
      </Box>

      <Box p={3}>
        <Typography variant="body2" mb={1.5}>
          Any transaction requires the confirmation of:
        </Typography>

        <Select
          value={requiredConfirmations}
          onChange={handleChange}
          color="error"
          sx={{ width: "62px" }}
        >
          {ownersList
            .filter((val) => val !== "")
            .map((val, index) => (
              <MenuItem key={index} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
        </Select>
        <Typography variant="body2" component="span" ml={1}>
          out of {ownersList.filter((val) => val !== "").length} owner(s)
        </Typography>
      </Box>
    </Paper>
  );
};

export default AddOwners;
