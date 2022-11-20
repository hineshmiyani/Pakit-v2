import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useEthers } from "@usedapp/core";
import {
  Paper,
  Typography,
  Chip,
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { ContentCopyRounded } from "@mui/icons-material";
import { ShareIcon } from "../../index";
import { styles } from "./styles";

const Review = () => {
  const { library } = useEthers();
  const [tooltipTitle, setTooltipTitle] = useState<string>("Copy to clipboard");
  const [{ ownersList, requiredConfirmations }, setOwnerData] = useState<any>({
    ownersList: [],
    requiredConfirmations: "",
  });

  useEffect(() => {
    const { ownersList, requiredConfirmations } =
      sessionStorage.getItem("ownersData") &&
      JSON.parse(sessionStorage.getItem("ownersData") || "");
    setOwnerData({ ownersList, requiredConfirmations });
  }, []);

  return (
    <Paper sx={styles.container}>
      <Box display="flex">
        <Box p={3} maxWidth="33%" flexBasis="33%">
          <Typography variant="body1" mb={3}>
            Details
          </Typography>

          <Typography variant="caption">
            Any transaction requires the confirmation of:
          </Typography>
          <Typography variant="body2" fontWeight="500" mb={3}>
            {requiredConfirmations} out of {ownersList.length} owners
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box maxWidth="67%" flexBasis="67%">
          <Box p={3}>
            <Typography variant="body1">
              {ownersList.length} Wallet Owners
            </Typography>
          </Box>

          <Divider />
          {ownersList.length > 0 &&
            ownersList?.map((address: string, index: number) => (
              <Box key={address + index}>
                <Stack
                  py={1}
                  px={3}
                  spacing={1}
                  direction="row"
                  alignItems="center"
                >
                  <Image
                    src="/asset/images/avatar.png"
                    width="32"
                    height="32"
                    alt=""
                    className="rounded-full object-cover"
                  />
                  <Typography variant="caption" component="p" width="340px">
                    <Typography variant="caption" fontWeight="bold">
                      {library?.network?.name?.substring(0, 2)}
                      {library?.network?.name?.substring(3, 4)}:
                    </Typography>{" "}
                    {address}
                  </Typography>
                  <Tooltip title={tooltipTitle} placement="top">
                    <IconButton
                      size="medium"
                      onClick={() => {
                        address && navigator.clipboard.writeText(address);
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
                          `https://${library?.network?.name}.etherscan.io/address/${address}`,
                          "_blank"
                        );
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Divider />
              </Box>
            ))}
        </Box>
      </Box>

      <Divider />
      <Box p={3}>
        <Typography variant="body1" component="div" gutterBottom>
          You&apos;re about to create a new Safe{" "}
          <Chip label={library?.network?.name} sx={styles.chip} /> on Goerli and
          will have to confirm a transaction with your currently connected
          wallet. The creation will cost approximately &gt; 0.001 GOR. The exact
          amount will be determined by your wallet.
        </Typography>
      </Box>
    </Paper>
  );
};

export default Review;
