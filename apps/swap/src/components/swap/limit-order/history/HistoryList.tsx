import { useMemo } from "react";
import { Box, makeStyles } from "components/Mui";
import { Flex, LoadingRow } from "@icpswap/ui";
import { useUserLimitTransactions } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { useScrollToTop } from "hooks/useScrollToTop";

import { HistoryHeader } from "./HistoryHeader";
import { HistoryRow } from "./HistoryRow";
import { LimitTransactionsEmpty } from "../Empty";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr) 120px",
    },
  };
});

export function HistoryList() {
  const classes = useStyles();

  const principal = useAccountPrincipal();

  const start_time = useMemo(() => {
    const now = parseInt(String(new Date().getTime() / 1000));
    return now - 60 * 24 * 3600;
  }, []);

  const { result: limitTransactionsResult, loading } = useUserLimitTransactions(
    principal?.toString(),
    start_time,
    0,
    100,
  );

  const limitTransactions = useMemo(() => {
    return limitTransactionsResult?.records;
  }, [limitTransactionsResult]);

  const scrollToTop = useScrollToTop();

  return (
    <>
      {loading ? (
        <Box sx={{ padding: "8px" }}>
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        </Box>
      ) : !limitTransactions || limitTransactions.length === 0 ? (
        <Flex fullWidth justify="center">
          <LimitTransactionsEmpty onClick={scrollToTop} />
        </Flex>
      ) : (
        <Box sx={{ width: "100%", minWidth: "1058px" }}>
          <HistoryHeader wrapperClasses={classes.wrapper} />
          <Flex vertical align="flex-start" fullWidth gap="8px 0">
            {limitTransactions.map((transaction, index) => (
              <HistoryRow key={index} transaction={transaction} wrapperClasses={classes.wrapper} />
            ))}
          </Flex>
        </Box>
      )}
    </>
  );
}
