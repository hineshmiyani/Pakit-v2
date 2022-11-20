import { SxProps } from "@mui/material";

interface IStyles {
  container: SxProps;
  text: SxProps;
  button: SxProps;
}

export const styles: IStyles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "primary.contrastText",
    backgroundImage: "url('../asset/images/background.webp')",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundPosition: "50% 25%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",
  },
  text: {
    color: "primary.main",
  },
  button: {
    backgroundColor: "primary.main",
    "&:hover": {
      backgroundColor: "primary.main",
    },
    color: "primary.contrastText",
    borderRadius: "4px",
    fontWeight: 600,
    fontSize: "16px",
    mt: "20px",
  },
};
