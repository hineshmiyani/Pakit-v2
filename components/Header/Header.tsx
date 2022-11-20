import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEthers } from "@usedapp/core";
import { Box, Stack, Typography } from "@mui/material";
import { AccountDialog } from "../index";
import { styles } from "./styles";

const Header = () => {
  const { library, account } = useEthers();

  return (
    <header className="header">
      {/* Logo Section  */}
      <Link href="/welcome">
        <Box sx={styles.logoContainer}>
          <Image
            src="/asset/images/pakitLogo.png"
            height={34}
            width={34}
            className="object-cover"
            alt=""
          />
          <Typography variant="h6" sx={styles.name}>
            Pakit
          </Typography>
        </Box>
      </Link>

      {/* Account Section */}
      <Box sx={styles.accountContainer}>
        <Image src="/asset/images/metamask.svg" alt="" width={30} height={30} />
        <Stack>
          <Typography variant="body2" color="primary.main">
            MetaMask @
            {library?.network?.name?.substring(0, 1)?.toUpperCase() +
              "" +
              library?.network?.name?.substring(1)}
          </Typography>
          <Stack direction="row" alignItems="center" spacing="8px">
            <Image
              src="/asset/images/avatar.png"
              alt=""
              width={12}
              height={12}
              className="rounded-full object-cover"
            />
            <Typography variant="body1" className="text-xs truncate">
              <Typography variant="caption" fontWeight="bold">
                {library?.network?.name?.substring(0, 2)}
                {library?.network?.name?.substring(3, 4)}:
              </Typography>{" "}
              {account?.slice(0, 6)}
              ...{account?.slice(-4)}
            </Typography>
          </Stack>
        </Stack>

        <AccountDialog />
      </Box>
    </header>
  );
};

export default Header;
