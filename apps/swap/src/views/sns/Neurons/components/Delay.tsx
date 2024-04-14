import React, { useMemo, useState } from "react";
import { Button, Grid, Typography, Box, InputAdornment } from "@mui/material";
import {
  parseTokenAmount,
  formatTokenAmount,
  uint8ArrayToBigInt,
  toHexString,
  toSignificantWithGroupSeparator,
} from "@icpswap/utils";
import { splitNeuron } from "@icpswap/hooks";
import BigNumber from "bignumber.js";
import CircularProgress from "@mui/material/CircularProgress";
import type { NervousSystemParameters } from "@icpswap/types";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import { TokenInfo } from "types/token";
import { Modal, NumberFilledTextField } from "components/index";
import MaxButton from "components/MaxButton";
import randomBytes from "randombytes";

export interface SetDissolveDelayProps {
  open: boolean;
  onClose: () => void;
  onSetSuccess?: () => void;
  token: TokenInfo | undefined;
  neuron_stake: bigint;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  neuronSystemParameters: NervousSystemParameters | undefined;
}

export function SetDissolveDelay({
  onSetSuccess,
  neuron_stake,
  token,
  governance_id,
  neuron_id,
  neuronSystemParameters,
}: SetDissolveDelayProps) {
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const neuron_minimum_stake = useMemo(() => {
    if (!neuronSystemParameters) return undefined;

    return neuronSystemParameters.neuron_minimum_stake_e8s[0];
  }, [neuronSystemParameters]);

  const handleSubmit = async () => {
    if (loading || !amount || !token || !governance_id || !neuron_id) return;

    setLoading(true);
    openFullscreenLoading();

    const nonceBytes = new Uint8Array(randomBytes(8));
    const memo = uint8ArrayToBigInt(nonceBytes);

    const { data, message, status } = await splitNeuron(
      governance_id,
      neuron_id,
      BigInt(formatTokenAmount(amount, token.decimals).toString()),
      memo,
    );

    const result = data ? data.command[0] : undefined;
    const split_neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!split_neuron_error) {
        openTip(t`Set dissolve delay successfully`, TIP_SUCCESS);
        if (onSetSuccess) onSetSuccess();
      } else {
        openTip(split_neuron_error.error_message, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to set dissolve delay`, TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  };

  const handleMax = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.stopPropagation();

    if (!token || !neuron_minimum_stake) return;

    setAmount(
      parseTokenAmount(
        new BigNumber(neuron_stake.toString()).minus(neuron_minimum_stake.toString()).minus(token.transFee.toString()),
        token.decimals,
      ).toString(),
    );
  };

  let error: string | undefined;

  if (amount === undefined) error = t`Enter the amount`;
  if (token === undefined) error = t`Some unknown error happened`;

  if (
    amount &&
    token &&
    neuron_minimum_stake &&
    new BigNumber(amount)
      .plus(parseTokenAmount(neuron_minimum_stake + token.transFee, token.decimals))
      .isGreaterThan(parseTokenAmount(neuron_stake, token.decimals))
  )
    error = t`Amount is too large`;
  if (
    amount &&
    token &&
    !new BigNumber(amount).minus(parseTokenAmount(token.transFee, token.decimals)).isGreaterThan(0)
  )
    error = t`Must be greater than trans fee`;

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" size="small">
        <Trans>Delay</Trans>
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={t`Set Dissolve Delay`}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0" }}>
          <Box>
            <Typography>Neuron ID</Typography>
            <Typography>{neuron_id ? toHexString(neuron_id) : "--"}</Typography>
          </Box>

          <Box>
            <Typography>Balance</Typography>
            <Typography>
              {neuron_stake && token
                ? toSignificantWithGroupSeparator(parseTokenAmount(neuron_stake, token.decimals).toString(), 6)
                : "--"}
            </Typography>
          </Box>

          <Box>
            <Typography>
              <Trans>Dissolve Delay</Trans>
            </Typography>
            <Typography>
              <Trans>
                Dissolve delay is the minimum amount of time you have to wait for the neuron to unlock, and ICS to be
                available again. Note, that dissolve delay only decreases when the neuron is in a dissolving state.
                Voting power is given to neurons with a dissolve delay of at least 1 month, 1 day.
              </Trans>
            </Typography>
          </Box>

          <NumberFilledTextField
            placeholder={t`Enter the amount`}
            value={amount}
            onChange={(value: string) => setAmount(value)}
            fullWidth
            numericProps={{
              allowNegative: false,
              decimalScale: token?.decimals,
            }}
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MaxButton onClick={handleMax} />
                </InputAdornment>
              ),
            }}
          />

          <Grid container alignItems="center">
            <Typography>
              {token ? (
                <Trans>
                  Balance:{" "}
                  {`${new BigNumber(
                    parseTokenAmount(neuron_stake, token.decimals).toFixed(token.decimals > 8 ? 8 : token.decimals),
                  ).toFormat()}`}
                </Trans>
              ) : (
                "--"
              )}
            </Typography>
          </Grid>
          <Typography>
            {token ? (
              <>
                <Trans>Fee:</Trans>
                {parseTokenAmount(token.transFee.toString(), token.decimals).toFormat()}&nbsp;
                {token.symbol}
              </>
            ) : (
              "--"
            )}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !!error}
            onClick={handleSubmit}
            startIcon={loading ? <CircularProgress size={26} color="inherit" /> : null}
          >
            {error || <Trans>Confirm</Trans>}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
