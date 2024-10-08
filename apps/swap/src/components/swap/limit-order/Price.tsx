import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Flex, MainCard, Slider } from "@icpswap/ui";
import { BigNumber, isNullArgs, percentToNum, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { SwapInput } from "components/swap/index";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";

export interface SwapLimitPriceProps {
  ui?: "pro" | "normal";
  orderPrice: string | Null;
  onInputOrderPrice: (value: string) => void;
  inputToken: Token | Null;
  outputToken: Token | Null;
  currentPrice: string | Null;
}

export const SwapLimitPrice = ({
  ui = "normal",
  inputToken,
  outputToken,
  onInputOrderPrice,
  currentPrice,
  orderPrice,
}: SwapLimitPriceProps) => {
  const [percent, setPercent] = useState<string | Null>(null);
  const [inputValue, setInputValue] = useState<string | Null>(null);
  const [showConvert, setShowConvert] = useState(false);

  const handleInvert = useCallback(() => {
    setShowConvert(!showConvert);
  }, [setShowConvert, showConvert]);

  const price = useMemo(() => {
    if (!currentPrice) return undefined;

    return showConvert ? new BigNumber(1).dividedBy(currentPrice).toString() : currentPrice;
  }, [currentPrice, showConvert]);

  const handleInputPrice = useCallback(
    (value: string) => {
      setInputValue(value);

      if (new BigNumber(value).isEqualTo(0) || !value) return;

      if (showConvert) {
        onInputOrderPrice(new BigNumber(1).dividedBy(value).toString());
      } else {
        onInputOrderPrice(value);
      }
    },
    [onInputOrderPrice, showConvert],
  );

  const handlePercentChange = useCallback(
    (percent: string) => {
      if (isNullArgs(currentPrice)) return;

      setPercent(percent);

      if (new BigNumber(percentToNum(percent)).isEqualTo(0)) {
        onInputOrderPrice("0");
        setInputValue("0");
        return;
      }

      const value = showConvert ? new BigNumber(1).dividedBy(currentPrice) : new BigNumber(currentPrice);
      const inputValue = value.multipliedBy(100).multipliedBy(percentToNum(percent)).toString();
      const price = showConvert ? new BigNumber(1).dividedBy(inputValue).toString() : inputValue;

      onInputOrderPrice(price);
      setInputValue(inputValue);
    },
    [setPercent, onInputOrderPrice, currentPrice, showConvert],
  );

  useEffect(() => {
    if (isNullArgs(orderPrice)) {
      setInputValue("");
    }
  }, [orderPrice]);

  return (
    <MainCard
      border="level4"
      level={ui === "pro" ? 1 : 3}
      padding={ui === "pro" ? "10px" : "16px"}
      borderRadius={ui === "pro" ? "12px" : undefined}
    >
      <Box sx={{ display: "grid", gap: "16px 0", gridTemplateColumns: "1fr" }}>
        <Flex gap="0 4px">
          <Typography>
            <Trans>Current Price</Trans>
          </Typography>
          <Typography
            color="text.primary"
            sx={{
              textDecoration: currentPrice ? "underline" : "none",
              cursor: "pointer",
            }}
          >
            {price ? toSignificantWithGroupSeparator(price) : "--"}
          </Typography>
        </Flex>

        <Flex>
          <Box sx={{ flex: 1 }}>
            <SwapInput align="left" token={outputToken} value={inputValue} onUserInput={handleInputPrice} />
          </Box>

          <Flex gap="0 8px">
            <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
              {inputToken && outputToken
                ? showConvert
                  ? `${outputToken.symbol} / ${inputToken.symbol}`
                  : `${inputToken.symbol} / ${outputToken.symbol}`
                : ""}
            </Typography>

            {inputToken && outputToken ? (
              <Box sx={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={handleInvert}>
                <img src="/images/ck-bridge-switch.svg" style={{ width: "24px", height: "24px" }} alt="" />
              </Box>
            ) : null}
          </Flex>
        </Flex>

        <Box sx={{ width: "50%" }}>
          <Slider percent={percent} onChange={handlePercentChange} labelLeft="0" labelRight="100x" />
        </Box>

        <Typography fontSize="12px">
          <Trans>Input price may slightly differ from the market price</Trans>
        </Typography>
      </Box>
    </MainCard>
  );
};
