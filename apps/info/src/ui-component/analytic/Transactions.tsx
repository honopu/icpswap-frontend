import { useState, useMemo, useCallback } from "react";
import { t, Trans } from "@lingui/macro";
import { enumToString } from "@icpswap/utils";
import { Header, HeaderCell, SortDirection, TransactionRow } from "@icpswap/ui";
import { PoolStorageTransaction } from "@icpswap/types";
import Pagination from "ui-component/pagination/cus";
import { ImageLoading, NoData } from "ui-component/index";
import { Box, Typography, useTheme, makeStyles } from "ui-component/Mui";
import { useTips, TIP_SUCCESS } from "hooks/index";
import copyToClipboard from "copy-to-clipboard";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "1.5fr repeat(5, 1fr)",

      "@media screen and (max-width: 780px)": {
        gridTemplateColumns: "1.5fr repeat(5, 1fr)",
      },
    },
  };
});

export interface TransactionsProps {
  transactions: PoolStorageTransaction[] | undefined | null;
  loading?: boolean;
  maxItems?: number;
  hasFilter?: boolean;
  showedTokens?: string[];
}

type Filter = "all" | "swaps" | "adds" | "removes";

export default function Transactions({
  transactions,
  maxItems = 10,
  loading,
  hasFilter,
  showedTokens,
}: TransactionsProps) {
  const theme = useTheme();
  const classes = useStyles();
  const [openTip] = useTips();
  const [page, setPage] = useState(1);

  const [sortField, setSortField] = useState<string>("timestamp");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const filteredTransactions = useMemo(() => {
    return transactions
      ? transactions
          .slice()
          .filter((ele) => {
            const type = enumToString(ele.action);
            if (filter === "swaps") return type === "swap";
            if (filter === "adds") return type === "increaseLiquidity" || type === "addLiquidity" || type === "mint";
            if (filter === "removes") return type === "decreaseLiquidity";
            return true;
          })
          .filter((ele) => {
            if (!showedTokens) return true;
            return showedTokens?.includes(ele.token0Id) && showedTokens?.includes(ele.token1Id);
          })
      : [];
  }, [transactions, filter, showedTokens]);

  const sortedTransactions = useMemo(() => {
    return filteredTransactions
      ? filteredTransactions
          .slice()
          .sort((a, b) => {
            if (a && b && !!sortField) {
              const bool =
                a[sortField as keyof PoolStorageTransaction] > b[sortField as keyof PoolStorageTransaction]
                  ? (sortDirection === SortDirection.ASC ? 1 : -1) * 1
                  : (sortDirection === SortDirection.ASC ? 1 : -1) * -1;

              return bool;
            }
            return 0;
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : [];
  }, [filteredTransactions, maxItems, page, sortField, sortDirection]);

  const handleSortChange = (sortField: string, sortDirection: SortDirection) => {
    setSortDirection(sortDirection);
    setSortField(sortField);
  };

  const Filters: { key: Filter; value: string }[] = [
    { key: "all", value: "All" },
    { key: "swaps", value: "Swaps" },
    { key: "adds", value: "Adds" },
    { key: "removes", value: "Removes" },
  ];

  const handleFilterChange = (filter: Filter) => {
    setPage(1);
    setFilter(filter);
  };

  const handleCopy = useCallback((address: string) => {
    copyToClipboard(address);
    openTip(t`Copy Success`, TIP_SUCCESS);
  }, []);

  return (
    <Box>
      <Header className={classes.wrapper} onSortChange={handleSortChange} defaultSortFiled={sortField}>
        <Box>
          {hasFilter ? (
            <Box sx={{ display: "flex", gap: "0 10px" }}>
              {Filters.map((ele) => (
                <Typography
                  key={ele.key}
                  sx={{
                    color: filter === ele.key ? "#ffffff" : theme.colors.darkPrimary400,
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                  onClick={() => handleFilterChange(ele.key)}
                >
                  {ele.value}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: theme.colors.darkPrimary400 }}>#</Typography>
          )}
        </Box>

        <HeaderCell field="amountUSD" isSort>
          <Trans>Total Value</Trans>
        </HeaderCell>

        <HeaderCell field="amountToken0" isSort>
          <Trans>Token Amount</Trans>
        </HeaderCell>

        <HeaderCell field="amountToken1" isSort>
          <Trans>Token Amount</Trans>
        </HeaderCell>

        <HeaderCell field="sender" isSort>
          <Trans>Account</Trans>
        </HeaderCell>

        <HeaderCell field="timestamp" isSort>
          <Trans>Time</Trans>
        </HeaderCell>
      </Header>

      {(sortedTransactions ?? []).map((transaction, index) => (
        <TransactionRow
          key={`${String(transaction.timestamp)}_${index}`}
          className={classes.wrapper}
          transaction={transaction}
          onAddressClick={handleCopy}
        />
      ))}

      {(sortedTransactions ?? []).length === 0 && !loading ? <NoData /> : null}

      {loading ? <ImageLoading loading={loading} /> : null}

      <Box mt="20px">
        {!loading && !!filteredTransactions?.length ? (
          <Pagination
            page={page}
            maxItems={maxItems}
            length={filteredTransactions?.length ?? 0}
            onPageChange={setPage}
          />
        ) : null}
      </Box>
    </Box>
  );
}
