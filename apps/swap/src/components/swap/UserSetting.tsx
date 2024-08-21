import { memo, useCallback, useState, useEffect } from "react";
import { Grid, Box, Typography, Card, InputAdornment } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Toggle from "components/Toggle";
import { useExpertModeManager, useSlippageManager, useMultipleApproveManager } from "store/swap/cache/hooks";
import { getDefaultSlippageTolerance, MAX_SLIPPAGE_TOLERANCE, SLIPPAGE_TOLERANCE } from "constants/swap";
import BigNumber from "bignumber.js";
import { Tooltip, NumberTextField, TextButton } from "components/index";
import { isDarkTheme } from "utils";
import { Theme } from "@mui/material/styles";
import { Trans } from "@lingui/macro";

const useStyles = makeStyles((theme: Theme) => {
  return {
    card: {
      backgroundColor: isDarkTheme(theme) ? "#202845" : theme.colors.lightGray200,
      borderRadius: `${theme.radius}px`,
      width: "390px",
      border: theme.palette.border.gray200,
      ...(isDarkTheme(theme)
        ? { boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.25)" }
        : { boxShadow: "0px 4px 16px 0px #00000040" }),
      "@media (max-width: 640px)": {
        width: "288px",
        padding: "12px",
      },
    },
    tolerance: {
      marginTop: "8px",
      display: "grid",
      gridTemplateColumns: "auto auto",
      gap: "0 5px",

      "@media (max-width: 640px)": {
        gridTemplateColumns: "1fr",
        gap: "5px 0",
      },
    },
    activeTypography: {
      position: "relative",
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: "-6px",
        left: 0,
        width: "100%",
        height: "4px",
        backgroundColor: theme.colors.secondaryMain,
      },
    },
    settingBox: {
      position: "absolute",
      right: "0",
      top: "0",
      cursor: "pointer",
    },
    slippageButton: {
      width: "48px",
      height: "40px",
      borderRadius: "8px",
      cursor: "pointer",
      marginRight: "8px",
      background: theme.palette.background.level4,
      "&:last-child": {
        marginRight: "0",
      },
      "&.active": {
        "& .MuiTypography-root": {
          color: "#ffffff",
        },
        background: theme.colors.secondaryMain,
      },
    },
    settingInput: {
      "& input": {
        padding: "10px 16px",
        borderRadius: "8px",
      },
      "& fieldset": {
        borderRadius: "8px",
      },
    },
  };
});

export interface UserSettingProps {
  onClose: () => void;
  type: string;
}

function SwapUserSetting({ type }: UserSettingProps) {
  const classes = useStyles();

  const [slippageValue, setSlippageValue] = useState<string>("");
  const [expertMode, toggleExpertMode] = useExpertModeManager();
  const [slippageTolerance, setSlippageTolerance] = useSlippageManager(type);
  const { multipleApprove, updateMultipleApprove } = useMultipleApproveManager();

  useEffect(() => {
    setSlippageValue(new BigNumber(slippageTolerance).div(1000).toString());
  }, []);

  const handleSlippageInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setSlippageValue(value);

      if (value !== "") {
        setSlippageTolerance(new BigNumber(value).multipliedBy(1000).toNumber());
      }
    },
    [setSlippageTolerance],
  );

  const handleSlippageBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      let value: number | string | BigNumber = event.target.value;

      const defaultSlippageTolerance = getDefaultSlippageTolerance(type);

      if (value === "") {
        value = new BigNumber(defaultSlippageTolerance).div(1000).toNumber();
        setSlippageValue(new BigNumber(defaultSlippageTolerance).div(1000).toString());
      } else if (new BigNumber(value).multipliedBy(1000).isGreaterThan(MAX_SLIPPAGE_TOLERANCE)) {
        value = new BigNumber(MAX_SLIPPAGE_TOLERANCE).div(1000);
        setSlippageValue(new BigNumber(MAX_SLIPPAGE_TOLERANCE).div(1000).toString());
      }

      setSlippageTolerance(new BigNumber(value).multipliedBy(1000).toNumber());
    },
    [setSlippageTolerance],
  );

  const handleToggleSlippage = (slippage: { id: string; value: number }) => {
    setSlippageTolerance(slippage.value);
    setSlippageValue(new BigNumber(slippage.value).dividedBy(1000).toString());
  };

  const handleMultipleApproveAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (!value) return;
    updateMultipleApprove(Number(value));
  };

  return (
    <Card
      className={classes.card}
      sx={{
        p: 3,
      }}
    >
      <Typography variant="h4" color="textPrimary">
        Setting
      </Typography>
      <Box mt={3}>
        <Grid container alignItems="center">
          <Typography mr={1} color="textPrimary">
            Slippage tolerance
          </Typography>
          <Tooltip
            tips="Your transaction will revert if the price changes unfavorably
                  by more than this percentage."
          />
        </Grid>
        <Box className={classes.tolerance}>
          <NumberTextField
            className={classes.settingInput}
            value={slippageValue}
            numericProps={{
              decimalScale: 2,
              allowNegative: false,
              maxLength: 6,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            onChange={handleSlippageInput}
            onBlur={handleSlippageBlur}
          />
          <Grid
            container
            alignContent="center"
            sx={{
              justifyContent: "flex-end",
              "@media (max-width: 640px)": {
                justifyContent: "flex-start",
              },
            }}
          >
            {SLIPPAGE_TOLERANCE.map((slippage, index) => (
              <Grid
                className={`${classes.slippageButton} ${
                  slippageTolerance === slippage.value && slippageValue !== "" ? "active" : ""
                }`}
                item
                key={index}
                container
                alignItems="center"
                justifyContent="center"
                onClick={() => handleToggleSlippage(slippage)}
              >
                <Typography>{new BigNumber(slippage.value).div(1000).toNumber()}%</Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Box mt={3}>
        <Grid container alignItems="center">
          <Typography mr={1} color="textPrimary">
            <Trans>Toggle Expert Mode</Trans>
          </Typography>
          <Tooltip tips="Allow high price impact trades and skip the confirm screen. Use at your own risk." />
        </Grid>
        <Box mt={1}>
          <Toggle isActive={expertMode} onToggleChange={toggleExpertMode} />
        </Box>
      </Box>

      <Box mt={3}>
        <Grid container alignItems="center">
          <Typography mr={1} color="textPrimary">
            <Trans>Approval Limit Settings</Trans>
          </Typography>

          {/* <Tooltip tips="Allow high price impact trades and skip the confirm screen. Use at your own risk."></Tooltip> */}
        </Grid>
        <Box mt={1} sx={{ display: "flex", alignItems: "center", gap: "0 9px" }}>
          <Box sx={{ width: "70px" }}>
            <NumberTextField
              className={classes.settingInput}
              numericProps={{ decimalScale: 0 }}
              value={multipleApprove}
              onChange={handleMultipleApproveAmountChange}
            />
          </Box>

          <Typography>
            <Trans>Multiple of the Swap Amount</Trans>
          </Typography>
        </Box>
      </Box>

      <Box mt={3}>
        <TextButton arrow to="/swap/revoke-approve">
          <Trans>Revoke Token Approval</Trans>
        </TextButton>
      </Box>
      {/* <Box mt={3}>
        <Grid container alignItems="center">
          <Typography mr={1} color="textPrimary">
            Disable Multihops
          </Typography>
          <Tooltip tips="Restricts swaps to direct pairs only."></Tooltip>
        </Grid>
        <Box mt={1}>
          <Toggle isActive={singleHop} onToggleChange={toggleSingleHop} />
        </Box>
      </Box> */}
    </Card>
  );
}

export default memo(SwapUserSetting);
