import React from "react";
import { Box, Typography } from "@mui/material";

type Props = {
  text: string;
};

const TxNotFound: React.FC<Props> = ({ text }) => {
  return (
    <Box
      height="calc(100vh - 300px)"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h5" fontWeight="600">
        {text}
      </Typography>
    </Box>
  );
};

export default TxNotFound;
