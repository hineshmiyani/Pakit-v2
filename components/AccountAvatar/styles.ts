import { SxProps } from "@mui/material";

interface IStyles {
  iconButton: SxProps;
  copyIcon: SxProps;
}

export const styles: IStyles = {
  iconButton: { backgroundColor: "secondary.contrastText" },
  copyIcon: { color: "disabled.main", fontSize: "20px" },
};
