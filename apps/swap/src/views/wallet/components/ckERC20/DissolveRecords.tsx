import { Box, Typography, Table, TableBody, TableCell, TableRow, TableContainer, TableHead } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { MainCard, NoData, ALink } from "components/index";
import { useAccountPrincipalString } from "store/auth/hooks";
import { parseTokenAmount } from "@icpswap/utils";
import { HeaderCell, BodyCell, LoadingRow } from "@icpswap/ui";
import { useWithdrawErc20TokenStatus, useChainKeyMinterInfo } from "@icpswap/hooks";
import type { WithdrawalSearchParameter, WithdrawalDetail, Erc20MinterInfo } from "@icpswap/types";
import { useMemo } from "react";
import { MINTER_CANISTER_ID, EXPLORER_TX_LINK, EXPLORER_ADDRESS_LINK } from "constants/ckERC20";
import { Principal } from "@dfinity/principal";
import { formatWithdrawalStatus } from "utils/web3/withdrawalState";
import { useTokenInfo } from "hooks/token";

interface ListItemProps {
  transaction: WithdrawalDetail;
  minterInfo: Erc20MinterInfo | undefined;
}

function ListItem({ transaction, minterInfo }: ListItemProps) {
  const { state, hash } = formatWithdrawalStatus(transaction.status);

  const { ledger_id } = useMemo(() => {
    if (!minterInfo) return {};

    const ckerc20_token = minterInfo.supported_ckerc20_tokens.find((e) => {
      return e[0].ckerc20_token_symbol === transaction.token_symbol;
    })?.[0];

    if (!ckerc20_token) return {};

    return {
      ledger_id: ckerc20_token.ledger_canister_id.toString(),
    };
  }, [minterInfo, transaction]);

  const { result: tokenInfo } = useTokenInfo(ledger_id);

  return (
    <TableRow>
      <TableCell>
        <BodyCell>{transaction.withdrawal_id.toString()}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>{state}</BodyCell>
      </TableCell>
      <TableCell>
        {hash ? (
          <BodyCell
            sx={{
              maxWidth: "400px",
              wordBreak: "break-all",
              whiteSpace: "break-spaces",
              "@media(max-width:640px)": { width: "300px" },
            }}
          >
            <ALink link={`${EXPLORER_TX_LINK}/${hash}`} color="primary" textDecorationColor="primary" fontSize="16px">
              {hash}
            </ALink>
          </BodyCell>
        ) : (
          <Typography>--</Typography>
        )}
      </TableCell>
      <TableCell>
        <BodyCell>{transaction.token_symbol}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>
          {tokenInfo
            ? parseTokenAmount(transaction.withdrawal_amount.toString(), tokenInfo?.decimals).toFormat()
            : transaction.withdrawal_amount.toString()}
        </BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell
          sx={{
            maxWidth: "400px",
            wordBreak: "break-all",
            whiteSpace: "break-spaces",
            "@media(max-width:640px)": { width: "300px" },
          }}
        >
          {/* <ALink
            link={`${EXPLORER_ADDRESS_LINK}/${transaction.from.toString()}`}
            color="primary"
            textDecorationColor="primary"
            fontSize="16px"
          >
            {transaction.from.toString()}
          </ALink> */}
          {transaction.from.toString()}
        </BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell
          sx={{
            maxWidth: "400px",
            wordBreak: "break-all",
            whiteSpace: "break-spaces",
            "@media(max-width:640px)": { width: "300px" },
          }}
        >
          <ALink
            link={`${EXPLORER_ADDRESS_LINK}/${transaction.recipient_address}`}
            color="primary"
            textDecorationColor="primary"
            fontSize="16px"
          >
            {transaction.recipient_address}
          </ALink>
        </BodyCell>
      </TableCell>
    </TableRow>
  );
}

export interface DissolveRecordsProps {
  refresh?: boolean | number;
}

export default function DissolveRecords({ refresh }: DissolveRecordsProps) {
  const principal = useAccountPrincipalString();
  const { result: minterInfo } = useChainKeyMinterInfo(MINTER_CANISTER_ID);

  const params = useMemo(() => {
    if (!principal) return undefined;

    return {
      BySenderAccount: {
        owner: Principal.fromText(principal),
        subaccount: [],
      },
    } as WithdrawalSearchParameter;
  }, [principal]);

  const { result: withdrawalResult, loading } = useWithdrawErc20TokenStatus({
    minter_id: MINTER_CANISTER_ID,
    params,
    refresh,
  });

  const Headers = [
    { key: "withdrawal_id", label: t`Withdrawal ID` },
    { key: "state", label: t`State` },
    { key: "hash", label: t`Txid` },
    { key: "token_symbol", label: t`Token` },
    { key: "withdrawal_amount", label: t`Amount` },
    { key: "from", label: t`From` },
    { key: "recipient", label: t`Recipient` },
  ];

  return (
    <MainCard>
      <Box sx={{ display: "flex", justifyItems: "center" }}>
        <Typography color="#ffffff">
          <Trans>Retrieved:</Trans>
        </Typography>
      </Box>

      <Box sx={{ margin: "0 0 3px 0" }}>
        {loading ? (
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {Headers.map((header) => (
                    <TableCell key={header.key}>
                      <HeaderCell>{header.label}</HeaderCell>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {withdrawalResult?.map((transaction, index) => (
                  <ListItem key={index} transaction={transaction} minterInfo={minterInfo} />
                ))}
              </TableBody>
            </Table>
            {withdrawalResult?.length === 0 || !withdrawalResult ? <NoData /> : null}
          </TableContainer>
        )}
      </Box>
    </MainCard>
  );
}
