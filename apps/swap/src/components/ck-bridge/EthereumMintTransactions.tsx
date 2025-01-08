import { Box, Typography } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { MainCard, NoData, ALink } from "components/index";
import { useAccountPrincipalString } from "store/auth/hooks";
import { parseTokenAmount } from "@icpswap/utils";
import { LoadingRow, Flex } from "@icpswap/ui";
import { useWithdrawErc20TokenStatus, useChainKeyMinterInfo } from "@icpswap/hooks";
import type { WithdrawalSearchParameter, WithdrawalDetail, Erc20MinterInfo } from "@icpswap/types";
import { useMemo } from "react";
import { MINTER_CANISTER_ID, EXPLORER_TX_LINK, EXPLORER_ADDRESS_LINK } from "constants/ckERC20";
import { Principal } from "@dfinity/principal";
import { formatWithdrawalStatus } from "utils/web3/withdrawalState";
import { useToken } from "hooks/index";
import { Token } from "@icpswap/swap-sdk";
import { useTheme } from "components/Mui";

interface TransactionProps {
  transaction: WithdrawalDetail;
  minterInfo: Erc20MinterInfo | undefined;
}

function Transaction({ transaction, minterInfo }: TransactionProps) {
  const theme = useTheme();
  const { state, hash } = formatWithdrawalStatus(transaction.status);

  const { ledger_id } = useMemo(() => {
    if (!minterInfo) return {};

    const supported_tokens = minterInfo.supported_ckerc20_tokens[0];

    if (!supported_tokens) return {};

    const ckerc20_token = supported_tokens.find((supported_token) => {
      return supported_token.ckerc20_token_symbol === transaction.token_symbol;
    });

    if (!ckerc20_token) return {};

    return {
      ledger_id: ckerc20_token.ledger_canister_id.toString(),
    };
  }, [minterInfo, transaction]);

  const [, token] = useToken(ledger_id);

  return (
    <Box
      sx={{
        padding: "16px",
        background: theme.palette.background.level1,
        border: `1px solid ${theme.palette.background.level4}`,
        borderRadius: "12px",
      }}
    >
      <Flex vertical gap="12px 0" align="flex-start">
        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Withdrawal ID</Trans>
          </Typography>
          <Typography>{transaction.withdrawal_id.toString()}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>State</Trans>
          </Typography>
          <Typography>{state}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Txid</Trans>
          </Typography>
          <Typography>
            {hash ? (
              <Typography
                sx={{
                  maxWidth: "400px",
                  wordBreak: "break-all",
                  whiteSpace: "break-spaces",
                  "@media(max-width:640px)": { width: "300px" },
                }}
              >
                <ALink
                  link={`${EXPLORER_TX_LINK}/${hash}`}
                  color="secondary"
                  textDecorationColor="primary"
                  fontSize="16px"
                >
                  {hash}
                </ALink>
              </Typography>
            ) : (
              <Typography>--</Typography>
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Token</Trans>
          </Typography>
          <Typography>{transaction.token_symbol}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Amount</Trans>
          </Typography>
          <Typography>
            {token
              ? parseTokenAmount(transaction.withdrawal_amount.toString(), token.decimals).toFormat()
              : transaction.withdrawal_amount.toString()}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>From</Trans>
          </Typography>
          <Typography
            sx={{
              maxWidth: "400px",
              wordBreak: "break-all",
              whiteSpace: "break-spaces",
              "@media(max-width:640px)": { width: "300px" },
            }}
          >
            {transaction.from.toString()}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Recipient</Trans>
          </Typography>

          <Typography
            sx={{
              maxWidth: "400px",
              wordBreak: "break-all",
              whiteSpace: "break-spaces",
              "@media(max-width:640px)": { width: "300px" },
            }}
          >
            <ALink
              link={`${EXPLORER_ADDRESS_LINK}/${transaction.recipient_address}`}
              color="secondary"
              textDecorationColor="secondary"
              fontSize="16px"
            >
              {transaction.recipient_address}
            </ALink>
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}

export interface DissolveRecordsProps {
  refresh?: boolean | number;
  token: Token | undefined;
  blockNumber: number | undefined;
}

export function Erc20DissolveTransactions({ refresh, blockNumber, token }: DissolveRecordsProps) {
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

  const transactions = useMemo(() => {
    if (!token || !withdrawalResult) return [];

    return withdrawalResult
      .filter((ele) => ele.token_symbol === token.symbol)
      .sort((a, b) => {
        if (a.withdrawal_id < b.withdrawal_id) return 1;
        if (a.withdrawal_id > b.withdrawal_id) return -1;
        return 0;
      });
  }, [withdrawalResult, token]);

  return (
    <MainCard level={1}>
      <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
        <Trans>Transactions</Trans>
      </Typography>

      <Box>
        {loading ? (
          <Box sx={{ padding: "24px 0" }}>
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
          </Box>
        ) : (
          <>
            {transactions?.map((transaction, index) => (
              <Transaction key={index} transaction={transaction} minterInfo={minterInfo} />
            ))}
            {transactions?.length === 0 || !transactions ? <NoData /> : null}
          </>
        )}
      </Box>
    </MainCard>
  );
}
