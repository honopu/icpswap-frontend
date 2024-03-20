import { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { t } from "@lingui/macro";
import { makeStyles, useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
  tabPanel: {
    fontSize: "18px",
    fontWeight: 500,
    color: theme.typography.secondary,
    cursor: "pointer",
    "&.active": {
      color: "#ffffff",
    },
    "@media(max-width: 640px)": {
      fontSize: "16px",
    },
  },
}));

enum TabPanelValue {
  TRANSACTIONS = "transactions",
  POSITIONS = "positions",
  RECLAIM = "reclaims",
  VALUATION = "valuation",
}

const TabPanels = [
  { label: t`Transactions`, value: TabPanelValue.TRANSACTIONS, link: "/swap-scan/transactions" },
  { label: t`Positions`, value: TabPanelValue.POSITIONS, link: "/swap-scan/positions" },
  { label: t`Reclaim`, value: TabPanelValue.RECLAIM, link: "/swap-scan/reclaims" },
  { label: t`Wallet Valuation`, value: TabPanelValue.VALUATION, link: "/swap-scan/valuation" },
];

export function SwapScanTabPanels() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme() as Theme;

  const activeTab = useMemo(() => {
    const arr = location.pathname.split("/");
    return arr[arr.length - 1] as TabPanelValue;
  }, [location]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: "0 30px",
        "@media(max-width: 640px)": {
          gap: "0 15px",
        },
      }}
    >
      {TabPanels.map((ele) => (
        <Typography
          key={ele.value}
          className={`${classes.tabPanel}${activeTab === ele.value ? " active" : ""}`}
          onClick={() => {
            history.push(ele.link);
          }}
          sx={{ position: "relative" }}
          component="div"
        >
          {ele.label}

          <Box
            sx={{
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translate(-50%, 0)",
              width: "28px",
              height: "4px",
              background: theme.colors.secondaryMain,
              display: activeTab === ele.value ? "block" : "none",
            }}
          />
        </Typography>
      ))}
    </Box>
  );
}
