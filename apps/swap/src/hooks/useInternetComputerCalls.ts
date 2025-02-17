import { useCallback } from "react";
import { useCallsData } from "@icpswap/hooks";
import type { CallResult } from "@icpswap/types";

export interface CanisterInfo {
  canister_id: string;
  controllers: string[] | undefined;
  module_hash: string;
  subnet_id: string;
}

export function useCanisterInfo(canisterId: string): CallResult<CanisterInfo> {
  return useCallsData(
    useCallback(async () => {
      const fetch_result = await fetch(`https://ic-api.internetcomputer.org/api/v3/canisters/${canisterId}`).catch(
        () => undefined,
      );
      if (!fetch_result) return undefined;
      return await fetch_result.json();
    }, []),
  );
}
