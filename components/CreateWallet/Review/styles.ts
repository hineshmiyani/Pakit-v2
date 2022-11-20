import { SxProps } from "@mui/material";

interface IStyles {
  container: SxProps;
  copyIcon: SxProps;
  chip: SxProps;
}

export const styles: IStyles = {
  container: {
    my: "30px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  },
  copyIcon: { color: "disabled.main", fontSize: "16px" },
  chip: {
    backgroundColor: "warning.light",
    fontWeight: "500",
    color: "white",
  },
};
