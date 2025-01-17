import { useMemo, useState, useCallback, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "components/Mui";
import { useTokenListTokenInfo, useInfoToken } from "@icpswap/hooks";
import { Token, Pool } from "@icpswap/swap-sdk";
import { type Null } from "@icpswap/types";
import { ICP } from "@icpswap/tokens";
import { SwapContext } from "components/swap/index";
import { ChartButton, ChartView } from "@icpswap/ui";

import { SwapProContext } from "./context";
import HotTokens from "./HotTokens";
import Swap from "./Swap";
import TokenUI from "./Token";
import TokenChartWrapper from "./TokenChart";
import Transactions from "./Transactions";
import { SearchWrapper } from "./layout/SearchWrapper";
import TokenChartInfo from "./TokenChart/Token";

export default function SwapPro() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeTab, setActiveTab] = useState<"SWAP" | "LIMIT">("SWAP");
  const [usdValueChange, setUSDValueChange] = useState<string | null>(null);
  const [selectedPool, setSelectedPool] = useState<Pool | null | undefined>(null);
  const [noLiquidity, setNoLiquidity] = useState<boolean | Null>(null);
  const [unavailableBalanceKeys, setUnavailableBalanceKeys] = useState<string[]>([]);
  const [inputToken, setInputToken] = useState<Token | Null>(undefined);
  const [outputToken, setOutputToken] = useState<Token | Null>(undefined);
  const [tradePoolId, setTradePoolId] = useState<string | undefined>(undefined);
  const [chartView, setChartView] = useState<ChartButton | null>({
    label: "DexScreener",
    value: ChartView.DexScreener,
  });

  const inputTokenInfo = useInfoToken(inputToken?.address);
  const outputTokenInfo = useInfoToken(outputToken?.address);

  const { inputTokenPrice, outputTokenPrice } = useMemo(() => {
    return {
      inputTokenPrice: inputTokenInfo?.priceUSD,
      outputTokenPrice: outputTokenInfo?.priceUSD,
    };
  }, [inputTokenInfo, outputTokenInfo]);

  const { token, infoToken } = useMemo(() => {
    if (!outputToken || !inputToken) return { token: undefined, infoToken: undefined };

    if (outputToken.address === ICP.address) return { token: inputToken, infoToken: inputTokenInfo };
    if (inputToken.address === ICP.address) return { token: outputToken, infoToken: outputTokenInfo };

    return { token: outputToken, infoToken: outputTokenInfo };
  }, [outputToken, inputToken, outputTokenInfo, inputTokenInfo]);

  const tokenId = useMemo(() => token?.address, [token]);

  const { result: tokenListInfo } = useTokenListTokenInfo(tokenId);

  const handleAddKeys = useCallback(
    (key: string) => {
      setUnavailableBalanceKeys((prevState) => [...new Set([...prevState, key])]);
    },
    [unavailableBalanceKeys, setUnavailableBalanceKeys],
  );

  const handleRemoveKeys = useCallback(
    (key: string) => {
      const newKeys = [...unavailableBalanceKeys];
      newKeys.splice(newKeys.indexOf(key), 1);
      setUnavailableBalanceKeys(newKeys);
    },
    [unavailableBalanceKeys, setUnavailableBalanceKeys],
  );

  useEffect(() => {
    if (token) {
      setChartView({
        label: "DexScreener",
        value: ChartView.DexScreener,
      });
    }
  }, [token, setChartView, tradePoolId]);

  return (
    <SwapContext.Provider
      value={{
        selectedPool,
        setSelectedPool,
        unavailableBalanceKeys,
        setUnavailableBalanceKey: handleAddKeys,
        removeUnavailableBalanceKey: handleRemoveKeys,
        usdValueChange,
        setUSDValueChange,
        noLiquidity,
        setNoLiquidity,
        inputToken,
        setInputToken,
        outputToken,
        setOutputToken,
      }}
    >
      <SwapProContext.Provider
        value={{
          inputToken,
          setInputToken,
          outputToken,
          setOutputToken,
          tradePoolId,
          setTradePoolId,
          inputTokenPrice,
          outputTokenPrice,
          token,
          chartView,
          setChartView,
          activeTab,
          setActiveTab,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Box sx={{ width: "100%", padding: "0 0 8px 0" }}>
            <Box sx={{ margin: "0 0 8px 0" }}>
              <SearchWrapper />
            </Box>

            <HotTokens />

            <Box
              sx={{
                margin: "8px 0 0 0",
                display: "flex",
                gap: "0 8px",
                "@media(max-width: 960px)": {
                  flexDirection: "column",
                  gap: "20px 0",
                },
              }}
            >
              <Box
                sx={{
                  width: "380px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px 0",
                  "@media(max-width: 960px)": {
                    gap: "20px 0",
                    width: "100%",
                  },
                }}
              >
                <Swap />

                {matchDownSM ? <TokenChartInfo infoToken={infoToken} tokenListInfo={tokenListInfo} /> : null}

                <TokenUI infoToken={infoToken} tokenListInfo={tokenListInfo} />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px 0",
                  overflow: "hidden",
                  "@media(max-width: 640px)": {
                    gap: "20px 0",
                  },
                }}
              >
                <TokenChartWrapper infoToken={infoToken} tokenListInfo={tokenListInfo} />
                <Transactions />
              </Box>
            </Box>
          </Box>
        </Box>
      </SwapProContext.Provider>
    </SwapContext.Provider>
  );
}
