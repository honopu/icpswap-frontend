import { useContext, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";

import { SwapProCardWrapper } from "../SwapProWrapper";
import { SwapProContext } from "../context";
import { PoolTransactions } from "./PoolTransactions";
import { UserTransactions } from "./UserTransactions";
import { Positions } from "./Positions";

enum TransactionPart {
  All = "all",
  YOUR = "your",
  POSITIONS = "positions",
}

const Menus = [
  { label: t`All Transactions`, value: TransactionPart.All },
  { label: t`Your Transactions`, value: TransactionPart.YOUR },
  { label: t`Your Positions`, value: TransactionPart.POSITIONS },
];

export default function Transactions() {
  const theme = useTheme() as Theme;
  const { tradePoolId } = useContext(SwapProContext);

  const [active, setActive] = useState<TransactionPart>(TransactionPart.All);

  return (
    <SwapProCardWrapper padding="16px 0px">
      <Box sx={{ padding: "0 16px" }}>
        <Box
          sx={{
            display: "flex",
            width: "fit-content",
            background: theme.palette.background.level1,
            padding: "4px",
            borderRadius: "15px",
          }}
        >
          {Menus.map((e) => (
            <Box
              key={e.value}
              className={e.value === active ? "active" : ""}
              sx={{
                cursor: "pointer",
                padding: "6px 10px",
                borderRadius: "12px",
                "&.active": {
                  background: theme.palette.background.level3,
                },
                "@media(max-width: 640px)": {
                  padding: "6px",
                },
              }}
              onClick={() => setActive(e.value)}
            >
              <Typography
                className={e.value === active ? "active" : ""}
                sx={{
                  "&.active": {
                    color: "text.primary",
                    fontWeight: 500,
                  },
                  "@media(max-width: 640px)": {
                    fontSize: "11px",
                  },
                }}
              >
                {e.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ margin: "10px 0 0 0" }}>
        {active === TransactionPart.All ? <PoolTransactions canisterId={tradePoolId} /> : null}
        {active === TransactionPart.YOUR ? <UserTransactions canisterId={tradePoolId} /> : null}
        {active === TransactionPart.POSITIONS ? <Positions canisterId={tradePoolId} /> : null}
      </Box>
    </SwapProCardWrapper>
  );
}