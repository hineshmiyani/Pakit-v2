import React from "react";
import { SxProps } from "@mui/material";

interface IStyles {
  menuContainer: React.CSSProperties;
  addressContainer: SxProps;
  copyIcon: SxProps;
  walletIcon: SxProps;
  disconnectButton: SxProps;
}

export const styles: IStyles = {
  menuContainer: {
    width: "280px",
    marginTop: "20px",
    marginLeft: "-20px",
  },
  addressContainer: {
    backgroundColor: "secondary.contrastText",
    borderRadius: "6px",
    p: "5px",
    alignItems: "center",
  },
  copyIcon: { color: "disabled.main", fontSize: "16px" },
  walletIcon: { color: "disabled.main" },
  disconnectButton: {
    backgroundColor: "primary.buttonColor",
    color: "primary.contrastText",
    width: "100%",
    "&:hover": {
      backgroundColor: "primary.buttonColor",
    },
  },
};
