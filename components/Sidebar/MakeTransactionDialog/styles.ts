import { SxProps } from "@mui/material";

interface IStyles {
  dialogTitle: SxProps;
  closeButton: SxProps;
  dialogContent: SxProps;
  button: SxProps;
  copyIcon: SxProps;
  iconButton: SxProps;
  balanceContainer: SxProps;
  divider: SxProps;
  dialogActions: SxProps;
  cancelButton: SxProps;
  submitButton: SxProps;
}

export const styles: IStyles = {
  dialogTitle: { m: 0, py: 2, px: 3 },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    color: "gray.500",
  },
  dialogContent: {
    p: "16px 24px",
    textAlign: "center",
    width: "620px",
  },
  button: {
    backgroundColor: "primary.buttonColor",
    border: "1px solid",
    borderColor: "primary.buttonColor",
    color: "primary.contrastText",
    p: "10px 40px",
    width: "240px",
    transition: " all .2s ease-in-out",
    fontSize: "18px",
    "&:hover": {
      backgroundColor: "primary.buttonColor",
      transform: "scale(1.05)",
    },
  },
  copyIcon: { color: "disabled.main", fontSize: "20px" },
  iconButton: { backgroundColor: "secondary.contrastText" },
  balanceContainer: {
    backgroundColor: "secondary.contrastText",
    m: "2px 0 0 44px",
    p: "5px 10px",
    width: "max-content",
    textAlign: "center",
    borderRadius: "5px",
    boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
  },
  divider: { mt: "24px", mb: "20px" },
  dialogActions: { justifyContent: "center", gap: 2 },
  cancelButton: {
    p: "8px 24px",
    transition: " all .2s ease-in-out",
    color: "primary.buttonColor",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  submitButton: {
    backgroundColor: "primary.buttonColor",
    color: "primary.contrastText",
    transition: " all .2s ease-in-out",
    p: "8px 24px",
    "&:hover": {
      backgroundColor: "primary.buttonColor",
      transform: "scale(1.05)",
    },
    "&:disabled": {
      backgroundColor: "grey.300",
    },
  },
};
