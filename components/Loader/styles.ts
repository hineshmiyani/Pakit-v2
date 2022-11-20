import { SxProps } from "@mui/material";

interface IStyles {
  container: SxProps;
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
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    // backgroundPosition: "50% 25%",
  },
};
