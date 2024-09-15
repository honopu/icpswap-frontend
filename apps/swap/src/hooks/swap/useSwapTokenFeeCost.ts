import { useMemo } from "react";
import { Token } from "@icpswap/swap-sdk";
import { getTokenInsufficient } from "hooks/swap/index";
import { BigNumber, isNullArgs } from "@icpswap/utils";

export interface useSwapTokenFeeCostProps {
  tokenBalance: BigNumber | undefined;
  subAccountBalance: BigNumber | undefined;
  unusedBalance: bigint | undefined;
  token: Token | undefined;
  amount: string | undefined;
}

export function useSwapTokenFeeCost({
  token,
  tokenBalance,
  subAccountBalance,
  unusedBalance,
  amount,
}: useSwapTokenFeeCostProps) {
  return useMemo(() => {
    if (
      isNullArgs(token) ||
      isNullArgs(tokenBalance) ||
      isNullArgs(subAccountBalance) ||
      isNullArgs(unusedBalance) ||
      isNullArgs(amount)
    )
      return undefined;

    const tokenInsufficient = getTokenInsufficient({
      token,
      subAccountBalance,
      balance: tokenBalance,
      formatTokenAmount: amount,
      unusedBalance,
    });

    if (tokenInsufficient === "NO_TRANSFER_APPROVE") return "0";
    if (tokenInsufficient === "NEED_DEPOSIT") return token.transFee.toString();
    if (tokenInsufficient === "NEED_TRANSFER_APPROVE") return (token.transFee * 2).toString();

    return "0";
  }, [token, tokenBalance, subAccountBalance, unusedBalance]);
}