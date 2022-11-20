import { SxProps } from "@mui/material";

interface IStyles {
  stepLabel: SxProps;
  buttonContainer: SxProps;
  actionsButton: SxProps;
  rejectButton: SxProps;
}

export const styles: IStyles = {
  stepLabel: {
    py: "4px",
    "& .MuiStepLabel-label.Mui-active, .MuiStepLabel-label.Mui-completed": {
      color: "primary.buttonColor",
      fontWeight: "600",
    },
    "& .MuiStepLabel-label.Mui-active > *, .MuiStepLabel-label.Mui-completed > *":
      {
        fontWeight: "600",
      },
  },
  buttonContainer: {
    my: 2,
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 1.5,
  },
  actionsButton: {
    backgroundColor: "primary.buttonColor",
    color: "primary.contrastText",
    px: "12px",
    width: "100px",
    transition: "all .2s ease-in-out",
    "&:hover": {
      backgroundColor: "primary.buttonColor",
      transform: "scale(1.1)",
    },
  },
  rejectButton: {
    color: "primary.buttonColor",
    borderColor: "primary.buttonColor",
    px: "12px",
    width: "100px",
    transition: "all .2s ease-in-out",
    "&:hover": {
      borderColor: "primary.buttonColor",
      transform: "scale(1.1)",
    },
  },
};
