import { useCallback, useEffect, useRef, useState } from "react";
import { Paper, Popper, Box, Typography, useMediaQuery, Fade, Button } from "@mui/material";
import { useTheme } from "components/Mui";
import { shorten } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useAccountPrincipal, useConnectorStateConnected, useConnectManager, useConnectorType } from "store/auth/hooks";
import { Flex } from "@icpswap/ui";
import { ConnectorImage, Image } from "components/Image/index";
import { ChevronDown } from "react-feather";
import { useHistory } from "react-router-dom";
import { Connector } from "constants/wallet";

import { AccountSection } from "./Account";
import Principal from "./Principal";
import LogOutSection from "../LogOutSection";
import { BalanceAndValue } from "./BalanceAndValue";

export default function ProfileSection() {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const prevOpen = useRef(open);
  const principal = useAccountPrincipal();
  const isConnected = useConnectorStateConnected();
  const history = useHistory();
  const connectorType = useConnectorType();

  const { showConnector, disconnect } = useConnectManager();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) return;
    setOpen(false);
  };

  const handleConnectWallet = async () => {
    await disconnect();
    showConnector(true);
  };

  useEffect(() => {
    if (anchorRef.current && prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleToWallet = useCallback(() => {
    history.push("/wallet");
  }, [history]);

  return (
    <Flex gap="0 4px">
      {isConnected ? (
        <Image
          src="/images/wallet.svg"
          sx={{ width: "30px", height: "30px", cursor: "pointer" }}
          onClick={handleToWallet}
        />
      ) : null}

      <Box ref={anchorRef} onClick={isConnected ? handleToggle : handleConnectWallet} sx={{ zIndex: 10 }}>
        {isConnected ? (
          <Flex
            gap="0 10px"
            sx={{
              padding: "4px 12px 4px 4px",
              borderRadius: "48px",
              background: theme.palette.background.level3,
              cursor: "pointer",
            }}
          >
            <ConnectorImage size="26px" />
            <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
              {principal ? shorten(principal.toString()) : ""}
            </Typography>
            <ChevronDown size="14px" strokeWidth="4px" color="#ffffff" />
          </Flex>
        ) : (
          <Button variant="contained" sx={{ width: "141px", height: "40px", borderRadius: "48px" }}>
            <Trans>Connect Wallet</Trans>
          </Button>
        )}
      </Box>

      <Popper
        placement={matchDownMD ? "bottom-start" : "bottom-end"}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [matchDownMD ? 200 : 0, 27],
              },
            },
          ],
        }}
        style={{
          zIndex: 10000,
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <Box
                sx={{
                  width: "310px",
                  padding: "12px",
                  borderRadius: "12px",
                  border: `1px solid #313852`,
                  background: "#242B45",
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <Box>
                    <Box sx={{ position: "absolute", top: "12px", right: "12px" }}>
                      <LogOutSection onLogout={() => setOpen(false)}>
                        <Image src="/images/logout.svg" sx={{ width: "32px", height: "32px", cursor: "pointer" }} />
                      </LogOutSection>
                    </Box>

                    <BalanceAndValue />

                    <Box
                      sx={{
                        margin: "12px 0 0 0",
                        background: "#2E354D",
                        borderRadius: "8px",
                        padding: "12px",
                      }}
                    >
                      <Typography
                        sx={{
                          lineHeight: "18px",
                          fontSize: "12px",
                        }}
                      >
                        <Trans>Copy Account ID for sending from exchanges and Principal ID for lCP network.</Trans>
                      </Typography>

                      <Box sx={{ margin: "12px 0 0 0" }}>
                        <AccountSection />
                      </Box>

                      <Box sx={{ margin: "12px 0 0 0" }}>
                        <Principal />
                      </Box>
                    </Box>

                    {connectorType === Connector.IC ? (
                      <Box
                        sx={{
                          margin: "4px 0 0 0",
                          background: "rgb(255 210 76 / 10%)",
                          borderRadius: "8px",
                          padding: "12px",
                        }}
                      >
                        <Typography
                          sx={{
                            lineHeight: "16px",
                            fontSize: "12px",
                            color: "#B79C4A",
                          }}
                        >
                          <Trans>
                            Internet Identity generates unique Principal IDs and Account IDs for each Dapp. This feature
                            ensures that user identities and account information are isolated across different
                            applications, enhancing security and privacy protection.
                          </Trans>
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                </ClickAwayListener>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Flex>
  );
}
