import { SxProps } from "@mui/material";

interface IStyles {
  container: SxProps;
  text: SxProps;
  button: SxProps;
}

export const styles: IStyles = {
  container: {
    minHeight: "100vh",
    background: "#FFE6E6",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    overflow: "hidden",
    p: 4,
  },
  text: {
    color: "#333333",
  },
  button: {
    backgroundColor: "primary.buttonColor",
    "&:hover": {
      backgroundColor: "primary.buttonColor",
    },
    color: "primary.contrastText",
    borderRadius: "4px",
    fontWeight: 600,
    fontSize: "16px",
    mt: "32px !important",
  },
};
