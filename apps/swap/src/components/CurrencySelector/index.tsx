import { useState, useMemo } from "react";
import { Token } from "@icpswap/swap-sdk";
import { useToken } from "hooks/useCurrency";

import Selector from "./selector";
import { CurrencySelectorButton } from "./button";

export interface CurrencySelectorProps {
  currencyId: string | undefined;
  onChange: (token: Token) => void;
  disabledCurrency?: Token[];
  bgGray?: boolean;
  loading?: boolean;
  disabled?: boolean;
  activeCurrencies?: Token[];
  maxWidth?: string;
}

export function CurrencySelector({
  currencyId,
  onChange,
  disabledCurrency,
  activeCurrencies,
  bgGray = false,
  loading,
  disabled = false,
  maxWidth,
}: CurrencySelectorProps) {
  const [selectorShow, setSelectorShow] = useState(false);

  const onTokenChange = (token: Token) => {
    if (onChange) onChange(token);
    setSelectorShow(false);
  };

  const [, token] = useToken(currencyId);

  const disabledCurrencyIds = useMemo(() => {
    if (disabledCurrency && disabledCurrency.length) {
      return disabledCurrency.map((currency) => currency?.address);
    }
    return [];
  }, [disabledCurrency]);

  const activeCurrencyIds = useMemo(() => {
    if (activeCurrencies && activeCurrencies.length) {
      return activeCurrencies.map((currency) => currency?.address);
    }
    return [];
  }, [activeCurrencies]);

  return (
    <>
      <CurrencySelectorButton
        currency={token}
        onClick={() => {
          if (disabled) return;
          setSelectorShow(true);
        }}
        bgGray={bgGray}
        loading={loading}
        disabled={disabled}
        maxWidth={maxWidth}
      />

      {selectorShow && (
        <Selector
          open={selectorShow}
          onClose={() => setSelectorShow(false)}
          onChange={onTokenChange}
          disabledCurrencyIds={disabledCurrencyIds}
          activeCurrencyIds={activeCurrencyIds}
        />
      )}
    </>
  );
}
