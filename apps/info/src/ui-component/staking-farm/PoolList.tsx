import { useMemo, useState } from "react";
import { Grid, Box, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { parseTokenAmount, pageArgsFormat, explorerLink } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import { getFarmPoolStatus, POOL_STATUS_COLORS } from "utils/farms/index";
import dayjs from "dayjs";
import { useTokenInfo } from "hooks/token/index";
import { feeAmountToPercentage } from "utils/swap/index";
import { LoadingRow, TextButton, PaginationType, Pagination } from "ui-component/index";
import type { FarmTvl } from "@icpswap/types";
import { useFarmInfo, useSwapPoolMetadata, useFarms } from "@icpswap/hooks";
import { useFarmTvl } from "hooks/staking-farm";
import { Header, HeaderCell, TableRow, BodyCell, NoData } from "@icpswap/ui";
import { Principal } from "@dfinity/principal";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "180px repeat(5, 1fr) 140px 120px",
      padding: "16px 0",
      alignItems: "center",
      minWidth: "1200px",
      gap: "0 5px",
    },
  };
});

export interface PoolItemProps {
  farmTVL: [Principal, FarmTvl];
}

export function PoolItem({ farmTVL }: PoolItemProps) {
  const classes = useStyles();

  const { farmId } = useMemo(() => {
    return { farmId: farmTVL[0].toString() };
  }, [farmTVL]);

  const { result: farmInfo, loading } = useFarmInfo(farmId);
  const { status, statusText } = getFarmPoolStatus(farmInfo) ?? { status: "", statusText: "" };
  const { result: swapPool } = useSwapPoolMetadata(farmInfo?.pool.toString());
  const { result: token0 } = useTokenInfo(swapPool?.token0.address);
  const { result: token1 } = useTokenInfo(swapPool?.token1.address);
  const { result: rewardToken } = useTokenInfo(farmInfo?.rewardToken.address);

  const { tvl } = useFarmTvl(farmId);

  return loading ? (
    <LoadingRow>
      <div />
      <div />
      <div />
      <div />
    </LoadingRow>
  ) : (
    <TableRow className={classes.wrapper}>
      <BodyCell>
        <Link href={explorerLink(farmId)}>{farmId}</Link>
      </BodyCell>
      <BodyCell>
        {token0 && token1 && farmInfo ? (
          <Link href={explorerLink(farmInfo.pool.toString())}>{`${token0.symbol}/${
            token1.symbol
          }/${feeAmountToPercentage(Number(farmInfo?.poolFee))}`}</Link>
        ) : (
          "--"
        )}
      </BodyCell>
      <BodyCell>{dayjs(Number(farmInfo?.startTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      <BodyCell>{dayjs(Number(farmInfo?.endTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      <BodyCell>
        <BodyCell>{String(farmInfo?.numberOfStakes)}</BodyCell>
        <BodyCell sub>{tvl ? `~$${tvl}` : "--"}</BodyCell>
      </BodyCell>
      <BodyCell>
        {farmInfo && rewardToken
          ? `${parseTokenAmount(farmInfo.totalReward, rewardToken.decimals).toFormat()} ${rewardToken.symbol}`
          : "--"}
      </BodyCell>
      <BodyCell>
        <Grid container alignItems="center">
          <Box
            sx={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: POOL_STATUS_COLORS[status],
              marginRight: "8px",
            }}
          />
          <BodyCell
            sx={{
              color: POOL_STATUS_COLORS[status],
            }}
          >
            {statusText}
          </BodyCell>
        </Grid>
      </BodyCell>
      <BodyCell>
        <TextButton to={`/farm/details/${farmId}`} sx={{ fontSize: "16px" }}>
          <Trans>Details</Trans>
        </TextButton>
      </BodyCell>
    </TableRow>
  );
}

export default function PoolList() {
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const { result: allFarms, loading } = useFarms(undefined);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const farms = useMemo(() => {
    if (!allFarms) return undefined;

    const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);
    const length = pagination.pageSize;

    return [...allFarms].slice(offset, offset + length);
  }, [allFarms, pagination]);

  const totalElements = useMemo(() => {
    if (!allFarms) return 0;
    return allFarms.length;
  }, [allFarms]);

  return (
    <Box sx={{ overflow: "auto" }}>
      <Header className={classes.wrapper}>
        <HeaderCell>
          <Trans>Canister ID</Trans>
        </HeaderCell>
        <HeaderCell>
          <Trans>Pool</Trans>
        </HeaderCell>
        <HeaderCell>
          <Trans>Start Time</Trans>
        </HeaderCell>
        <HeaderCell>
          <Trans>End Time</Trans>
        </HeaderCell>
        <HeaderCell>
          <Trans>Position Amount</Trans>
        </HeaderCell>
        <HeaderCell>
          <Trans>Reward Amount</Trans>
        </HeaderCell>
        <HeaderCell>
          <Trans>Status</Trans>
        </HeaderCell>
        <HeaderCell>&nbsp;</HeaderCell>
      </Header>

      {farms?.map((farm) => <PoolItem key={farm[0].toString()} farmTVL={farm} />)}

      {farms?.length === 0 && !loading ? <NoData /> : null}

      {loading ? (
        <Box sx={{ padding: "16px" }}>
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
            <div />
            <div />
          </LoadingRow>
        </Box>
      ) : null}

      {Number(totalElements) > 0 ? (
        <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} />
      ) : null}
    </Box>
  );
}
