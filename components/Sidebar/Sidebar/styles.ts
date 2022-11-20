import { SxProps } from "@mui/material";

interface IStyles {
  container: SxProps;
  addButton: SxProps;
  addWalletText: SxProps;
  iconButton: SxProps;
  copyIcon: SxProps;
  balanceText: SxProps;
  actionsButton: SxProps;
}

export const styles: IStyles = {
  container: {
    height: "max(calc(100vh - 66px), 100%)",
    backgroundColor: "primary.contrastText",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px;",
    position: "fixed",
    width: "inherit",
  },
  addButton: {
    color: "primary.buttonColor",
    transition: " all .2s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  addWalletText: { color: "primary.main", fontWeight: "500", ml: 1 },
  iconButton: { backgroundColor: "secondary.contrastText" },
  copyIcon: { color: "disabled.main", fontSize: "20px" },
  balanceText: {
    color: "primary.main",
    fontSize: "14px",
    fontWeight: "500",
  },
  actionsButton: {
    backgroundColor: "primary.buttonColor",
    border: "1px solid",
    borderColor: "primary.buttonColor",
    color: "primary.contrastText",
    p: "8px 12px",
    width: "145px",
    transition: " all .2s ease-in-out",
    "&:hover": {
      backgroundColor: "primary.buttonColor",
      transform: "scale(1.05)",
    },
  },
};
