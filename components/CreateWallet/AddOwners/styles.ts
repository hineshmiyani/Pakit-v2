import { SxProps } from "@mui/material";

interface IStyles {
  container: SxProps;
  chip: SxProps;
  addressInput: SxProps;
  addOwnerButton: SxProps;
}

export const styles: IStyles = {
  container: {
    py: "24px",
    my: "30px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  },
  chip: {
    backgroundColor: "warning.light",
    fontWeight: "500",
    color: "white",
  },
  addressInput: {
    maxWidth: "59%",
    flexBasis: "59%",
    ml: 2.5,
  },
  addOwnerButton: {
    color: "primary.buttonColor",
    p: "8px 12px",
    m: "10px auto",
  },
};
