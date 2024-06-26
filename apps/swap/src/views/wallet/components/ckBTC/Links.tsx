import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { ckBTC_MINTER_ID, ckBTC_DASHBOARD } from "constants/ckBTC";
import { explorerLink } from "@icpswap/utils";

import { Link } from "../Link";

export default function BTC_Links() {
  return (
    <Box
      sx={{ margin: "30px 0 0 0", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px 0" }}
    >
      <Link href={ckBTC_DASHBOARD} label={<Trans>Open in ckBTC Dashboard</Trans>} fontSize="12px" />

      <Link href={explorerLink(ckBTC_MINTER_ID)} label={<Trans>Open in ckBTC canister</Trans>} fontSize="12px" />
    </Box>
  );
}
