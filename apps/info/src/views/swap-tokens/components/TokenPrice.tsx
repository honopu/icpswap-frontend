import { Typography, Box, useTheme } from "ui-component/Mui";
import { toSignificant, BigNumber } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import { usePoolIdWithICP } from "hooks/swap/usePoolIdWithICP";
import { usePool } from "hooks/info/usePool";
import { useMemo } from "react";
import { TokenImage } from "ui-component/index";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";

export interface TokenPriceProps {
  token0: Token | Null;
  token1Symbol: string | undefined;
  price: number | undefined;
}

export function TokenPrice({ token0, token1Symbol, price }: TokenPriceProps) {
  const theme = useTheme();

  return token0 && token1Symbol && price ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <TokenImage size="18px" sx={{ margin: "0 6px 0 0" }} logo={token0.logo} tokenId={token0.address} />
      <Typography color="text.primary" fontWeight={500}>
        1 {token0?.symbol} = {toSignificant(price, 4)} {token1Symbol}
      </Typography>
    </Box>
  ) : null;
}

export function TokenPrices({ tokenInfo }: { tokenInfo: Token | undefined }) {
  const theme = useTheme();

  const poolId = usePoolIdWithICP(tokenInfo?.address);
  const { result: pool } = usePool(poolId);

  const icpPrice = useMemo(() => {
    if (!pool || !tokenInfo?.address) return undefined;

    return pool.token0Id === tokenInfo.address ? pool.token1Price : pool.token0Price;
  }, [pool, tokenInfo?.address]);

  const tokenPrice = useMemo(() => {
    if (!pool || !tokenInfo?.address) return undefined;

    return pool.token0Id === tokenInfo.address ? pool.token0Price : pool.token1Price;
  }, [pool, tokenInfo?.address]);

  const icpRatio = tokenPrice && icpPrice ? new BigNumber(icpPrice).dividedBy(tokenPrice).toNumber() : undefined;
  const tokenRatio = tokenPrice && icpPrice ? new BigNumber(tokenPrice).dividedBy(icpPrice).toNumber() : undefined;

  return tokenPrice && icpPrice && tokenInfo ? (
    <Box
      sx={{
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <TokenPrice token0={ICP} token1Symbol={tokenInfo?.symbol} price={icpRatio} />
      <Box sx={{ width: "10px" }} />
      <TokenPrice token0={tokenInfo} price={tokenRatio} token1Symbol={ICP.symbol} />
    </Box>
  ) : null;
}
