import React, { useState } from "react";
import { Button, Typography, Box, InputAdornment, CircularProgress } from "components/Mui";
import { parseTokenAmount, formatTokenAmount, formatDollarAmount, BigNumber } from "@icpswap/utils";
import { claimOrRefreshNeuron } from "@icpswap/hooks";
import { tokenTransfer } from "hooks/token/calls";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { Modal, NumberFilledTextField, MaxButton } from "components/index";
import { useTokenBalance } from "hooks/token";
import { useAccountPrincipal } from "store/auth/hooks";
import { useUSDPriceById } from "hooks";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

export interface StakeProps {
  open: boolean;
  onClose: () => void;
  onStakeSuccess?: () => void;
  token: Token | undefined;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  disabled?: boolean;
}

export function Stake({ onStakeSuccess, token, governance_id, neuron_id, disabled }: StakeProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const tokenUSDPrice = useUSDPriceById(token?.address);
  const { result: balance } = useTokenBalance(token?.address, principal);

  const handleSubmit = async () => {
    if (loading || !amount || !principal || !token || !governance_id || !neuron_id) return;

    setLoading(true);
    openFullscreenLoading();

    const { message, status } = await tokenTransfer({
      canisterId: token.address,
      to: governance_id,
      subaccount: [...neuron_id],
      amount: formatTokenAmount(amount, token.decimals),
      from: principal.toString(),
    });

    if (status === "ok") {
      await claimOrRefreshNeuron(governance_id, neuron_id);
      openTip(t`Staked successfully`, TIP_SUCCESS);
      if (onStakeSuccess) onStakeSuccess();
    } else {
      openTip(message ?? t`Failed to stake`, TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  };

  const handleMax = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.stopPropagation();
    if (!token || !balance) return;
    setAmount(parseTokenAmount(new BigNumber(balance).minus(token.transFee.toString()), token.decimals).toString());
  };

  let error: string | undefined;
  if (amount === undefined) error = t("common.enter.input.amount");
  if (token === undefined) error = t("common.error.unknown");
  if (
    amount &&
    token &&
    balance &&
    parseTokenAmount(new BigNumber(balance).minus(token.transFee.toString()), token.decimals).isLessThan(amount)
  )
    error = t("common.error.insufficient.balance");

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" size="small" disabled={disabled}>
        {t("common.stake")}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={t("nns.increase.stake")}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px 0" }}>
          <NumberFilledTextField
            placeholder={t("common.enter.input.amount")}
            value={amount}
            onChange={(value: string) => setAmount(value)}
            fullWidth
            numericProps={{
              allowNegative: false,
              decimalScale: token?.decimals,
            }}
            autoComplete="off"
            textFieldProps={{
              slotProps: {
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <MaxButton onClick={handleMax} />
                    </InputAdornment>
                  ),
                },
              },
            }}
          />

          <Typography>
            {token && balance && tokenUSDPrice
              ? t("common.balance.colon.amount", {
                  amount: `${new BigNumber(
                    parseTokenAmount(balance, token.decimals).toFixed(token.decimals > 8 ? 8 : token.decimals),
                  ).toFormat()} ${token.symbol} (${formatDollarAmount(
                    parseTokenAmount(balance, token.decimals).multipliedBy(tokenUSDPrice).toString(),
                  )})`,
                })
              : "--"}
          </Typography>

          <Typography>
            {token
              ? t("common.fee.colon.amount", {
                  amount: `${parseTokenAmount(token.transFee.toString(), token.decimals).toFormat()} ${token.symbol}`,
                })
              : "--"}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || error !== undefined}
            onClick={handleSubmit}
            startIcon={loading ? <CircularProgress size={26} color="inherit" /> : null}
          >
            {error || t("common.confirm")}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
