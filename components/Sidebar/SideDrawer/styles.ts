import { SxProps } from "@mui/material";

interface IStyles {
  addButton: SxProps;
  addIcon: SxProps;
  addWalletText: SxProps;
  listButton: SxProps;
  listText: SxProps;
  actionsButton: SxProps;
}

export const styles: IStyles = {
  addButton: {
    color: "primary.buttonColor",
    transition: " all .2s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  addIcon: { fontSize: "46px" },
  addWalletText: { color: "primary.main", fontSize: "18px", fontWeight: "700" },
  listButton: {
    backgroundColor: "grey.200",
    py: 0.2,
    px: 4,
  },
  listText: {
    py: "10px",
    px: 4,
    textAlign: "center",
  },
  actionsButton: {
    backgroundColor: "primary.buttonColor",
    border: "1px solid",
    borderColor: "primary.buttonColor",
    color: "primary.contrastText",
    p: "8px 12px",
    width: "145px",
    transition: "all .2s ease-in-out",
    "&:hover": {
      backgroundColor: "primary.buttonColor",
      transform: "scale(1.05)",
    },
  },
};
