import { Typography, Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { MainCard, SelectPair } from "ui-component/index";
import { useInfoAllPools, useTokensFromList } from "@icpswap/hooks";
import Pools from "ui-component/analytic/Pools";
import InTokenListCheck from "ui-component/InTokenListCheck";
import { useState, useMemo } from "react";
import { ICP } from "constants/tokens";

export default function TopPools() {
  const [onlyTokenList, setOnlyTokenList] = useState(true);
  const [selectedPair, setSelectedPair] = useState<undefined | string>(undefined);

  const { result: pools, loading } = useInfoAllPools();

  const { result: tokenList } = useTokensFromList();

  const handleCheckChange = (checked: boolean) => {
    setOnlyTokenList(checked);
  };

  const filteredAllPools = useMemo(() => {
    if (!pools || !tokenList) return undefined;

    const tokenListIds = tokenList.map((token) => token.canisterId).concat(ICP.address);

    return pools
      .filter((pool) => {
        if (onlyTokenList) {
          return tokenListIds.includes(pool.token0Id) && tokenListIds.includes(pool.token1Id);
        }

        return pool;
      })
      .filter((pool) => pool.feeTier === BigInt(3000))
      .filter((pool) => {
        if (!selectedPair) return true;

        return pool.pool === selectedPair;
      });
  }, [pools, onlyTokenList, tokenList, selectedPair]);

  const handlePairChange = (pairId: string | undefined) => {
    setSelectedPair(pairId);
  };

  return (
    <MainCard>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          "@media(max-width: 860px)": {
            flexDirection: "column",
            gap: "10px 0",
          },
        }}
      >
        <Typography variant="h4">
          <Trans>Top Pools</Trans>
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "0 10px",
            alignItems: "center",
            width: "fit-content",
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: "10px 0",
              alignItems: "flex-start",
            },
          }}
        >
          <Box
            sx={{
              width: "240px",
              height: "40px",
              "@media(max-width: 640px)": {
                width: "100%",
              },
            }}
          >
            <SelectPair value={selectedPair} onPairChange={handlePairChange} />
          </Box>

          <InTokenListCheck onChange={handleCheckChange} checked={onlyTokenList} />
        </Box>
      </Box>

      <Box mt="20px" sx={{ overflow: "auto" }}>
        <Box sx={{ minWidth: "1200px" }}>
          <Pools pools={filteredAllPools} loading={loading} />
        </Box>
      </Box>
    </MainCard>
  );
}
