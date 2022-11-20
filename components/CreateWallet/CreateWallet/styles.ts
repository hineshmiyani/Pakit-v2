import { SxProps } from "@mui/material";

interface IStyles {
  container: SxProps;
  chip: SxProps;
  customStepperConnector: SxProps;
  customStepper: SxProps;
  buttonContainer: SxProps;
  backButton: SxProps;
  continueButton: SxProps;
}

export const styles: IStyles = {
  container: { width: "80%", m: "20px auto" },
  chip: {
    backgroundColor: "warning.light",
    fontWeight: "500",
    color: "white",
  },
  customStepperConnector: {
    "&.MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
      borderColor: "primary.buttonColor",
    },
    "&.MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
      borderColor: "primary.buttonColor",
    },
  },
  customStepper: {
    "& .MuiStepLabel-root .Mui-completed": {
      color: "primary.buttonColor", // circle color (COMPLETED)
    },
    "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
      color: "red.500", // Just text label (COMPLETED)
    },
    "& .MuiStepLabel-root .Mui-active": {
      color: "primary.buttonColor", // circle color (ACTIVE)
    },
    "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
      color: "primary.buttonColor", // Just text label (ACTIVE)
    },
    "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
      fill: "primary.contrastText", // circle's number (ACTIVE)
    },
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    pt: 2,
    gap: 1,
  },
  backButton: {
    color: "primary.buttonColor",
    px: "12px",
    width: "100px",
    transition: " all .2s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  continueButton: {
    backgroundColor: "primary.buttonColor",
    color: "primary.contrastText",
    px: "12px",
    width: "100px",
    transition: " all .2s ease-in-out",
    "&:hover": {
      backgroundColor: "primary.buttonColor",
      transform: "scale(1.05)",
    },
  },
};
