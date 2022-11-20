import { SxProps } from "@mui/material";

interface IStyles {
  container: SxProps;
  chip: SxProps;
}

export const styles: IStyles = {
  container: {
    p: "24px",
    my: "30px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  },
  chip: {
    backgroundColor: "warning.light",
    fontWeight: "500",
    color: "white",
  },
};
