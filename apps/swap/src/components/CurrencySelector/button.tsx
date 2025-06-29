import { useCallback } from "react";
import { Typography, useTheme } from "components/Mui";
import { isDarkTheme } from "utils";
import { Token } from "@icpswap/swap-sdk";
import { TokenImage, Loading } from "components/index";
import { Flex } from "@icpswap/ui";
import { ChevronDown } from "react-feather";
import { useTranslation } from "react-i18next";

export interface CurrencySelectorButtonProps {
  currency: undefined | null | Token;
  onClick?: () => void;
  bgGray?: boolean;
  loading?: boolean;
  disabled?: boolean;
  maxWidth?: string;
}

export function CurrencySelectorButton({
  currency,
  onClick,
  bgGray = false,
  loading,
  maxWidth,
}: CurrencySelectorButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const handleButtonClick = useCallback(() => {
    if (loading) return;
    if (onClick) onClick();
  }, [loading, onClick]);

  return currency ? (
    <Flex
      sx={{
        padding: "8px",
        cursor: "pointer",
        backgroundColor: isDarkTheme(theme)
          ? theme.palette.background.level2
          : bgGray
          ? theme.colors.lightGray200
          : "#ffffff",
        borderRadius: "12px",
      }}
      onClick={handleButtonClick}
      gap="0 8px"
      justify="space-between"
    >
      <Flex gap="0 8px">
        <TokenImage logo={currency.logo} size="24px" tokenId={currency.address} />

        <Typography
          sx={{
            color: "text.primary",
            fontSize: "18px",
            fontWeight: 500,
            maxWidth,
          }}
          className="text-overflow-ellipsis"
        >
          {currency.symbol}
        </Typography>
      </Flex>

      <ChevronDown size={14} color={theme.colors.darkTextSecondary} />

      {loading && <Loading loading={loading} circularSize={20} />}
    </Flex>
  ) : (
    <Flex
      sx={{
        padding: "8px",
        height: "40px",
        background: theme.palette.background.level2,
        color: "#ffffff",
        cursor: "pointer",
        borderRadius: "12px",
      }}
      onClick={handleButtonClick}
    >
      <Flex gap="0 8px" sx={{ width: "fit-content" }}>
        <Typography color="text.primary">{t("common.select.a.token")}</Typography>

        <ChevronDown size={14} color="#ffffff" />
      </Flex>
    </Flex>
  );
}
