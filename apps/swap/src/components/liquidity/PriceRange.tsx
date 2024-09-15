import { memo, useState, useMemo, useCallback } from "react";
import { Box, Grid, Typography, makeStyles, useTheme, Theme } from "components/Mui";
import { Token, Price } from "@icpswap/swap-sdk";
import { Bound, FeeAmount, ZOOM_LEVEL_INITIAL_MIN_MAX } from "constants/swap";
import { MAX_SWAP_INPUT_LENGTH } from "constants/index";
import { TokenToggle } from "components/TokenToggle";
import { isDarkTheme } from "utils/index";
import { Trans, t } from "@lingui/macro";
import { NumberTextField } from "components/index";
import { Flex } from "@icpswap/ui";
import { BigNumber, formatDollarAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { useUSDPrice } from "hooks/useUSDPrice";

import PriceRangeChart from "./PriceRangeChart";
import { FullRangeWarning } from "./FullRangeWarning";
import { PriceRangeSelector } from "./PriceRangeSelector";
import { RangeButton } from "./RangeButton";

const useSetPriceStyle = makeStyles((theme: Theme) => {
  return {
    startPriceDescription: {
      padding: "16px",
      borderRadius: "12px",
      border: `1px solid ${theme.colors.warningDark}`,
      backgroundColor: theme.palette.background.level3,
      ". description": {
        color: theme.colors.warningDark,
        fontSize: "12px",
      },
    },
    startPrice: {
      border: isDarkTheme(theme) ? "1px solid #29314F" : `1px solid ${theme.colors.lightGray200BorderColor}`,
      background: isDarkTheme(theme) ? "transparent" : "#fff",
      borderRadius: "12px",
      height: "51px",
      padding: "0 14px",
    },
    priceRangeInput: {
      position: "relative",
    },
    fullRangeButton: {
      borderRadius: "12px",
      backgroundColor: isDarkTheme(theme) ? theme.colors.darkLevel1 : "#ffffff",
      border: theme.palette.border.gray200,
      color: isDarkTheme(theme) ? theme.palette.grey[700] : theme.colors.lightTextPrimary,
      textTransform: "none",
      "&:hover": {
        backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.light + 20 : theme.palette.primary.light,
        borderColor: theme.palette.mode === "dark" ? "#29314F" : theme.palette.grey[100],
      },
    },
  };
});

const RANGE_BUTTONS = [
  { value: "5", text: "± 5%" },
  { value: "10", text: "± 10%" },
  { value: "20", text: "± 20%" },
  { value: "50", text: "± 50%" },
  { value: "75", text: "± 75%" },
];

export interface PriceRangeProps {
  onStartPriceInput: (value: string) => void;
  onLeftRangeInput: (value: string) => void;
  onRightRangeInput: (value: string) => void;
  startPrice: string | number | undefined;
  noLiquidity?: boolean;
  priceLower: Price<Token, Token> | undefined;
  priceUpper: Price<Token, Token> | undefined;
  baseCurrency: Token | undefined;
  quoteCurrency: Token | undefined;
  feeAmount: FeeAmount | undefined;
  ticksAtLimit: {
    [Bound.LOWER]: boolean | undefined;
    [Bound.UPPER]: boolean | undefined;
  };
  price: string | number | undefined;
  getDecrementLower: () => string;
  getIncrementLower: () => string;
  getDecrementUpper: () => string;
  getIncrementUpper: () => string;
  getSetFullRange: () => void;
  handleTokenToggle: () => void;
  poolLoading?: boolean;
  getRangeByPercent: (value: string | number) => [string, string] | undefined;
}

export const PriceRange = memo(
  ({
    onStartPriceInput,
    onLeftRangeInput,
    onRightRangeInput,
    startPrice,
    noLiquidity,
    priceLower,
    priceUpper,
    baseCurrency,
    quoteCurrency,
    feeAmount,
    ticksAtLimit,
    price,
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
    handleTokenToggle,
    poolLoading,
    getRangeByPercent,
  }: PriceRangeProps) => {
    const theme = useTheme();
    const classes = useSetPriceStyle();

    const [fullRangeWaring, setFullRangeWarning] = useState(false);
    const [rangeValue, setRangeValue] = useState<string | null>(null);

    const tokenA = (baseCurrency ?? undefined)?.wrapped;
    const tokenB = (quoteCurrency ?? undefined)?.wrapped;
    const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB);

    const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    const isRangePriceDisabled = useMemo(
      () => (noLiquidity && !startPrice) || poolLoading,
      [noLiquidity, startPrice, poolLoading],
    );

    const handleRange = useCallback(
      (rangeValue: string) => {
        setFullRangeWarning(false);
        setRangeValue(rangeValue);

        if (rangeValue !== "FullRange") {
          const range = getRangeByPercent(rangeValue);

          if (range) {
            onLeftRangeInput(range[0]);
            onRightRangeInput(range[1]);
          }
        }
      },
      [setRangeValue, getRangeByPercent],
    );

    const handleIUnderstand = useCallback(() => {
      setFullRangeWarning(true);
      getSetFullRange();
    }, []);

    const handleReset = useCallback(() => {
      if (feeAmount && price) {
        const zoomLevel = ZOOM_LEVEL_INITIAL_MIN_MAX[feeAmount];

        const minPrice = new BigNumber(price).multipliedBy(zoomLevel.min).toString();
        const maxPrice = new BigNumber(price).multipliedBy(zoomLevel.max).toString();

        onLeftRangeInput(minPrice);
        onRightRangeInput(maxPrice);
        setRangeValue(null);
        setFullRangeWarning(false);
      }
    }, [price, ZOOM_LEVEL_INITIAL_MIN_MAX, feeAmount, onLeftRangeInput, onRightRangeInput, setRangeValue]);

    const fullRangeShow = useMemo(() => {
      return rangeValue === "FullRange" && !fullRangeWaring;
    }, [rangeValue, fullRangeWaring]);

    const baseTokenPrice = useUSDPrice(baseCurrency);

    return (
      <>
        {noLiquidity && (
          <>
            <Typography variant="h4" color="textPrimary">
              <Trans>Set Starting Price</Trans>
            </Typography>
            <Box mt={2}>
              <Box className={classes.startPriceDescription}>
                <Typography color={theme.colors.warningDark} fontSize={12} lineHeight="16px">
                  <Trans>
                    Before you can add liquidity, this pool needs to be initialized. Creating a trading pair incurs 1
                    ICP fee for setting up the Swap pool canister. To begin, select an initial price for the pool,
                    determine your liquidity price range, and decide on the deposit amount. Please be aware that if the
                    liquidity pool is being established for the first time, the creation of a new canister might require
                    some time.
                  </Trans>
                </Typography>
              </Box>
              <Box mt={2}>
                <NumberTextField
                  value={startPrice}
                  fullWidth
                  placeholder="0.0"
                  variant="outlined"
                  numericProps={{
                    allowNegative: false,
                    thousandSeparator: true,
                    decimalScale: 8,
                    maxLength: MAX_SWAP_INPUT_LENGTH,
                  }}
                  onChange={(e) => onStartPriceInput(e.target.value)}
                />
              </Box>
              <Flex sx={{ margin: "16px 0" }} className={classes.startPrice} justify="space-between">
                <Typography sx={{ marginRight: "8px" }}>
                  <Trans>Current {baseCurrency?.symbol} Price:</Trans>
                </Typography>

                <Flex gap="0 4px">
                  <Typography
                    fontWeight={600}
                    color="textPrimary"
                    align="right"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {startPrice ? `${startPrice}` : "- "}
                  </Typography>
                  <Typography fontWeight={600} color="text.primary">
                    {quoteCurrency?.symbol}
                  </Typography>
                </Flex>
              </Flex>
            </Box>
          </>
        )}
        <Box>
          <Flex justify="space-between">
            <Typography variant="h4" color="text.primary">
              <Trans>Set Price Range</Trans>
            </Typography>
            {baseCurrency && quoteCurrency && (
              <Box sx={{ width: "fit-content" }}>
                <TokenToggle currencyA={baseCurrency} currencyB={quoteCurrency} handleToggle={handleTokenToggle} />
              </Box>
            )}
          </Flex>

          <Box
            sx={
              isRangePriceDisabled
                ? {
                    opacity: "0.2",
                    pointerEvents: "none",
                  }
                : {}
            }
          >
            {!noLiquidity && (
              <Box mt={3} sx={{ position: "relative" }}>
                <Grid sx={{ height: "28px" }} container alignItems="center">
                  <Flex gap="0 2px" align="flex-start">
                    <Typography fontSize="12px" sx={{ lineHeight: "16px" }}>
                      <Trans>Current Price: </Trans>
                    </Typography>
                    <Flex sx={{ width: "210px" }} wrap="wrap" gap="6px 0">
                      <Typography
                        color="text.primary"
                        fontSize="12px"
                        sx={{ wordBreak: "break-all", lineHeight: "16px" }}
                      >
                        {price ? toSignificantWithGroupSeparator(price) : "--"}
                        <Typography component="span" sx={{ marginLeft: "5px" }} fontSize="12px">
                          {quoteCurrency?.symbol} per {baseCurrency?.symbol}
                        </Typography>
                      </Typography>
                      {baseTokenPrice ? (
                        <Typography sx={{ fontSize: "12px" }}>({formatDollarAmount(baseTokenPrice)})</Typography>
                      ) : null}
                    </Flex>
                  </Flex>
                </Grid>

                <Box mt={3}>
                  {/* @ts-ignore */}
                  <PriceRangeChart
                    priceLower={priceLower}
                    priceUpper={priceUpper}
                    ticksAtLimit={ticksAtLimit}
                    onLeftRangeInput={onLeftRangeInput}
                    onRightRangeInput={onRightRangeInput}
                    currencyA={baseCurrency}
                    currencyB={quoteCurrency}
                    feeAmount={feeAmount}
                    price={price}
                  />
                </Box>
              </Box>
            )}

            <Box mt={4} className={classes.priceRangeInput}>
              <Box
                sx={{
                  opacity: fullRangeShow ? 0.05 : 1,
                }}
              >
                <Grid container justifyContent="space-between">
                  <Grid item sx={{ width: "48%" }}>
                    <PriceRangeSelector
                      label={t`Min Price`}
                      value={
                        ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ? "0" : leftPrice?.toSignificant(5) ?? ""
                      }
                      onRangeInput={onLeftRangeInput}
                      decrement={isSorted ? getDecrementLower : getIncrementUpper}
                      increment={isSorted ? getIncrementLower : getDecrementUpper}
                      decrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
                      incrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
                      baseCurrency={baseCurrency}
                      quoteCurrency={quoteCurrency}
                    />
                  </Grid>
                  <Grid item sx={{ width: "48%" }}>
                    <PriceRangeSelector
                      label={t`Max Price`}
                      value={
                        ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ? "∞" : rightPrice?.toSignificant(6) ?? ""
                      }
                      onRangeInput={(value) => onRightRangeInput(value)}
                      decrement={isSorted ? getDecrementUpper : getIncrementLower}
                      increment={isSorted ? getIncrementUpper : getDecrementLower}
                      isUpperFullRange={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
                      incrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
                      decrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
                      baseCurrency={baseCurrency}
                      quoteCurrency={quoteCurrency}
                    />
                  </Grid>
                </Grid>

                {!noLiquidity ? (
                  <Box sx={{ margin: "12px 0 0 0" }}>
                    <Flex gap="12px" wrap="wrap">
                      {RANGE_BUTTONS.map(({ value, text }) => (
                        <RangeButton key={value} text={text} value={value} onClick={handleRange} active={rangeValue} />
                      ))}

                      {!noLiquidity ? (
                        <RangeButton
                          key="FullRange"
                          text="Full Range"
                          value="FullRange"
                          onClick={handleRange}
                          active={fullRangeWaring ? "FullRange" : undefined}
                        />
                      ) : null}

                      <Typography
                        sx={{
                          width: "fit-content",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontWeight: 500,
                          "&:hover": {
                            opacity: 0.6,
                          },
                        }}
                        onClick={handleReset}
                      >
                        Reset
                      </Typography>
                    </Flex>
                  </Box>
                ) : null}
              </Box>

              {fullRangeShow && <FullRangeWarning onUnderstand={handleIUnderstand} />}
            </Box>
          </Box>
        </Box>
      </>
    );
  },
);