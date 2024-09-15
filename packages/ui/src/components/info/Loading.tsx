import LoadingImage from "assets/images/loading.png";

import { Box, useTheme } from "../Mui";

export function SwapAnalyticLoading({ loading }: { loading: boolean }) {
  const theme = useTheme();

  return loading ? (
    <Box
      sx={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        top: "0",
        left: "0",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: theme.palette.background.level2,
        zIndex: 100,
      }}
    >
      <img width="80px" height="80px" src={LoadingImage} alt="" />
    </Box>
  ) : null;
}