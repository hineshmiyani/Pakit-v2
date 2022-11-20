import { SxProps } from "@mui/material";

interface IStyles {
  tabsContainer: SxProps;
  tab: SxProps;
  accordionContainer: SxProps;
  accordionSummary: SxProps;
  confirmationText: SxProps;
}

export const styles: IStyles = {
  tabsContainer: {
    "& .MuiTabs-indicator": {
      backgroundColor: "primary.buttonColor",
    },
  },
  tab: {
    fontSize: "16px",
    fontWeight: "600",
    "&.Mui-selected": {
      color: "primary.buttonColor",
    },
  },
  accordionContainer: {
    my: 1.5,
    borderRadius: "4px !important",
    "&::before": { height: 0 },
  },
  accordionSummary: {
    "&.MuiAccordionSummary-root.Mui-expanded": {
      minHeight: "50px",
    },
    "& > .MuiAccordionSummary-content.Mui-expanded": {
      m: "12px 0",
    },
  },
  confirmationText: {
    color: "primary.buttonColor",
    flexBasis: "20%",
    maxWidth: "20%",
    fontWeight: "600",
  },
};
