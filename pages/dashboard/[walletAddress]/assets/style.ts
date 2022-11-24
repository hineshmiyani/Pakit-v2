import { SxProps } from "@mui/material";

interface IStyles {
  tabsContainer: SxProps;
  tab: SxProps;
  container: SxProps;
  datagridContainer: SxProps;
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
  container: {
    display: "flex",
    maxWidth: "100%",
    borderRadius: "8px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  },
  datagridContainer: { height: 272, width: "100%", p: 0.4 },
};
