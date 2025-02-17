import { useCallback } from "react";
import { resultFormat, isAvailablePageArgs } from "@icpswap/utils";
import { tokenStorage } from "@icpswap/actor";
import {
  PublicTokenChartDayData,
  TokenTransaction,
  PublicTokenPricesData,
  TokenPoolsInfo,
  InfoToken,
  Null,
} from "@icpswap/types";
import { useCallsData } from "../useCallData";

export async function getStorageInfoToken(storageId: string, tokenId: string) {
  return resultFormat<InfoToken>(await (await tokenStorage(storageId)).getToken(tokenId)).data;
}

export function useStorageInfoToken(storageId: string | undefined, tokenId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!tokenId || !storageId) return undefined;
      return await getStorageInfoToken(storageId!, tokenId!);
    }, [storageId, tokenId]),
  );
}

export async function getInfoTokenChartData(storageId: string, tokenId: string, offset: number, limit: number) {
  return resultFormat<PublicTokenChartDayData[]>(
    await (await tokenStorage(storageId)).getTokenChartData(tokenId, BigInt(offset), BigInt(limit)),
  ).data;
}

export function useInfoTokenChartData(
  storageId: string | undefined,
  tokenId: string | undefined,
  offset: number,
  limit: number,
) {
  return useCallsData(
    useCallback(async () => {
      if (!storageId || !tokenId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getInfoTokenChartData(storageId!, tokenId!, offset, limit);
    }, [storageId, tokenId, offset, limit]),
  );
}

export async function getInfoTokenTransactions(storageId: string, tokenId: string, offset: number, limit: number) {
  return resultFormat<TokenTransaction[]>(
    await (await tokenStorage(storageId)).getTokenTransactions(tokenId, BigInt(offset), BigInt(limit)),
  ).data;
}

export function useInfoTokenTransactions(
  storageId: string | undefined,
  tokenId: string | undefined,
  offset: number,
  limit: number,
) {
  return useCallsData(
    useCallback(async () => {
      if (!storageId || !tokenId || !isAvailablePageArgs(offset, limit)) return undefined;

      return await getInfoTokenTransactions(storageId!, tokenId!, offset, limit);
    }, [storageId, tokenId, offset, limit]),
  );
}

export async function getInfoTokenPriceChart(
  storageId: string,
  tokenId: string,
  time: number,
  interval: number,
  limit: number,
) {
  return resultFormat<PublicTokenPricesData[]>(
    await (await tokenStorage(storageId)).getTokenPricesData(tokenId, BigInt(time), BigInt(interval), BigInt(limit)),
  ).data;
}

export function useInfoTokenPriceChart(
  storageId: string | undefined,
  tokenId: string | undefined,
  time: number | undefined,
  interval: number | undefined,
  limit: number,
) {
  return useCallsData(
    useCallback(async () => {
      if (!storageId || !tokenId || (!time && time !== 0) || !interval) return undefined;

      return await getInfoTokenPriceChart(storageId!, tokenId!, time!, interval!, limit);
    }, [storageId, tokenId, time, interval, limit]),
  );
}

export async function getInfoPoolsOfToken(storageId: string, tokenId: string) {
  return resultFormat<TokenPoolsInfo[]>(await (await tokenStorage(storageId)).getPoolsForToken(tokenId)).data;
}

export function useInfoPoolsOfToken(storageId: string | Null, tokenId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!storageId || !tokenId) return undefined;
      return await getInfoPoolsOfToken(storageId!, tokenId!);
    }, [tokenId, storageId]),
  );
}
