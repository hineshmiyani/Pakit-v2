import { SxProps } from "@mui/material";

interface IStyles {
  logoContainer: SxProps;
  name: SxProps;
  accountContainer: SxProps;
}

export const styles: IStyles = {
  logoContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  name: { color: "primary.main", fontWeight: "600", ml: 1 },
  accountContainer: { display: "flex", alignItems: "center", gap: 1 },
};
