import React from "react";
import Image from "next/image";
import { Container, Stack, Typography } from "@mui/material";
import { PropagateLoader } from "react-spinners";
import { styles } from "./styles";

const Loader = () => {
  return (
    <>
      <Container maxWidth={false} sx={styles.container}>
        <Stack direction="row" alignItems="center" spacing={1} mb="40px">
          <Image
            src="/asset/images/pakitLogo.png"
            height={100}
            width={100}
            className="object-cover shadow-slate-400 shadow-md"
            alt="logo"
          />
          <Typography
            variant="h6"
            gutterBottom
            color="primary.main"
            fontWeight="semi-bold"
          >
            Loading the Pakit Wallet...
          </Typography>
        </Stack>
        <PropagateLoader color="#374151" className="bg-fuchsia-500" size={20} />
      </Container>
    </>
  );
};

export default Loader;
