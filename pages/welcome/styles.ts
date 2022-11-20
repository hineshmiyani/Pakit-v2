import { SxProps } from "@mui/material";

interface IStyles {
  title: SxProps;
  subtitle: SxProps;
  paperContainer: SxProps;
  cardContainer: SxProps;
}

export const styles: IStyles = {
  title: {
    fontSize: "32px",
    lineHeight: "36px",
    fontWeight: "bold",
    mt: "26px",
  },
  subtitle: {
    lineHeight: "26px",
    fontWeight: "normal",
    my: "18px",
  },
  paperContainer: {
    display: "flex",
    maxWidth: "fit-content",
    borderRadius: "8px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  },
  cardContainer: {
    maxWidth: "800px",
    borderRadius: "8px",
    boxShadow: "0",
  },
};
