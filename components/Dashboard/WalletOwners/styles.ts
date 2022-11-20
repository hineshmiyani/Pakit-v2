import { SxProps } from "@mui/material";

interface IStyles {
  iconButton: SxProps;
  copyIcon: SxProps;
  container: SxProps;
  datagridContainer: SxProps;
}

export const styles: IStyles = {
  iconButton: { backgroundColor: "secondary.contrastText" },
  copyIcon: { color: "disabled.main", fontSize: "20px" },
  container: {
    display: "flex",
    maxWidth: "100%",
    borderRadius: "8px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  },
  datagridContainer: { height: 271, width: "100%", p: 0.4 },
};
