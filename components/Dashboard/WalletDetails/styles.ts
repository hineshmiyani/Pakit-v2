import { SxProps } from "@mui/material";

interface IStyles {
  container: SxProps;
  cardContainer: SxProps;
  cardContent: SxProps;
  chip: SxProps;
  transactionButton: SxProps;
}

export const styles: IStyles = {
  container: {
    display: "flex",
    maxWidth: "100%",
    borderRadius: "8px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  },
  cardContainer: {
    maxWidth: "100%",
    flexBasis: "100%",
    borderRadius: "8px",
    boxShadow: "0",
  },
  cardContent: { p: "24px 24px 0", position: "relative" },
  chip: {
    backgroundColor: "warning.light",
    fontWeight: "500",
    color: "white",
    position: "absolute",
    right: "24px",
    top: "24px",
  },
  transactionButton: {
    backgroundColor: "primary.buttonColor",
    border: "1px solid",
    borderColor: "primary.buttonColor",
    color: "primary.contrastText",
    p: "8px 12px",
    transition: " all .2s ease-in-out",
    "&:hover": {
      backgroundColor: "primary.buttonColor",
      transform: "scale(1.05)",
    },
  },
};
