import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    disabled: Palette["primary"];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    disabled: PaletteOptions["primary"];
  }

  interface PaletteColor {
    buttonColor?: string;
  }
  interface SimplePaletteColorOptions {
    buttonColor?: string;
  }
}
// Update the Button's color prop options
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    disabled: true;
  }
}

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    "2xl": true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#374151",
      dark: "#",
      contrastText: "#ffffff",
      buttonColor: "#f02525",
    },
    secondary: {
      main: "#020202",
      dark: "#",
      contrastText: "#f6f7f8",
    },
    disabled: {
      main: grey[500],
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
  },
  typography: {
    fontFamily: [
      "Poppins",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    button: {
      textTransform: "none",
    },
    h1: {
      fontSize: "5rem",
    },
  },
});

export const txProgressStepperStyles = {
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
};

export const txProgressStepperConnector = {
  "&.MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
    borderColor: "primary.buttonColor",
  },
  "&.MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
    borderColor: "primary.buttonColor",
  },
};
