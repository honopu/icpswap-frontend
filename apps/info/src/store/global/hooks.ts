import { useEffect, useMemo, useCallback } from "react";
import { updateICPBlocks, updateUserLocale, updateICPPriceList, updateXDR2USD } from "./actions";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/tokens";
import { useICPBlocksCall } from "hooks/useICPCalls";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { use100ICPPriceInfo } from "@icpswap/hooks";
import { useDispatch } from "react-redux";
import { timestampFormat, parseTokenAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";

export function useICPBlocksManager() {
  const dispatch = useAppDispatch();
  const { result } = useICPBlocksCall();
  const { blocks, secondBlocks } = result ?? {};

  useEffect(() => {
    dispatch(updateICPBlocks({ blocks: blocks ?? "", secondBlocks: secondBlocks ?? "" }));
  }, [dispatch, blocks, secondBlocks]);

  return useMemo(
    () => ({
      blocks,
      secondBlocks,
    }),
    [blocks, secondBlocks],
  );
}

export function useICPPrice() {
  const ICPPriceList = useICPPriceList();

  return useMemo(() => {
    if (ICPPriceList && ICPPriceList.length) {
      const price = ICPPriceList[ICPPriceList.length - 1]["usd"];
      return price;
    }
    return undefined;
  }, [ICPPriceList]);
}

export function useUSDValueFromICPAmount(value: number | null | string | undefined | bigint) {
  const ICPPrice = useICPPrice();

  return useMemo(() => {
    if (!ICPPrice || !value) return undefined;

    return new BigNumber(ICPPrice).multipliedBy(parseTokenAmount(value, WRAPPED_ICP_TOKEN_INFO.decimals));
  }, [ICPPrice, value]);
}

export function useXDR2USD() {
  return useAppSelector((state) => state.global.xdr_usdt);
}

export function useUpdateXDR2USD() {
  const dispatch = useDispatch();

  return useCallback(
    (xdr_usdt: number) => {
      dispatch(updateXDR2USD(xdr_usdt));
    },
    [dispatch],
  );
}

export function useICPPriceList() {
  return useAppSelector((state) => state.global.ICPPriceList);
}

export function useUserLocale() {
  return useAppSelector((state) => state.global.userLocale);
}

export function useUserLocaleManager() {
  const dispatch = useAppDispatch();
  const locale = useUserLocale();

  const setLocale = useCallback(
    (newLocale) => {
      dispatch(updateUserLocale(newLocale));
    },
    [dispatch],
  );

  return [locale, setLocale];
}

export function useICPPrices() {
  const dispatch = useAppDispatch();
  const xdr_usdt = useXDR2USD();

  const { result: icpPrices } = use100ICPPriceInfo();

  useEffect(() => {
    if (xdr_usdt && icpPrices) {
      const prices = icpPrices.map((icpPrice) => {
        return {
          usd: Number(new BigNumber(icpPrice[1]).div(10000).multipliedBy(xdr_usdt).toFixed(4)),
          timestamp: timestampFormat(new BigNumber(icpPrice[0]).times(1000).toNumber()),
          xdr: new BigNumber(icpPrice[1]).div(10000).toNumber(),
        };
      });

      dispatch(updateICPPriceList(prices.slice(prices.length - 120, prices.length - 1)));
    }
  }, [xdr_usdt, icpPrices]);
}