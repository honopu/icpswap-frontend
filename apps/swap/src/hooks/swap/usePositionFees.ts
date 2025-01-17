import { useMemo } from "react";
import { usePositionFee } from "@icpswap/hooks";

export function usePositionFees(
  canisterId: string | undefined,
  positionId: bigint | string | undefined | number,
  refresh?: number | boolean,
) {
  const { result } = usePositionFee(canisterId, positionId ? BigInt(positionId) : undefined, refresh);

  return useMemo(() => {
    return {
      amount0: result?.tokensOwed0,
      amount1: result?.tokensOwed1,
    };
  }, [result]);
}
