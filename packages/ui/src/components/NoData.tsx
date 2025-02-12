import { Box, Typography } from "@mui/material";

export interface NoDataProps {
  tip?: string;
}

export function NoData({ tip }: NoDataProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 0",
      }}
    >
      <img src="/images/empty.svg" alt="" width="100px" height="75px" />

      {tip ? (
        <Typography sx={{ maxWidth: "690px" }} color="text.primary" mt="10px" align="center">
          {tip}
        </Typography>
      ) : (
        <Typography sx={{ textAlign: "center" }}>No result found</Typography>
      )}
    </Box>
  );
}
