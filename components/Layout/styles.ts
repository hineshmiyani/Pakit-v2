import { SxProps } from "@mui/material";

interface IStyles {
  container: SxProps;
}

export const styles: IStyles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "secondary.contrastText",
    pt: "66px",
    px: "0 !important",
  },
};
