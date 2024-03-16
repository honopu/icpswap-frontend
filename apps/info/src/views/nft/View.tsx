import { useCallback, FC, useState } from "react";
import { Link as ReactLink, useParams, useHistory } from "react-router-dom";
import { Breadcrumbs, Typography, Grid, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MainCard from "ui-component/cards/MainCard";
import NFTTransactions from "ui-component/NFT/NFTTransactions";
import NFTActivity from "ui-component/NFT/NFTActivity";
import NFTInfo from "ui-component/NFT/Info";
import { Trans, t } from "@lingui/macro";
import Wrapper from "ui-component/Wrapper";

const useStyles = makeStyles(() => {
  return {
    breadcrumbs: {
      padding: "0 0 25px 16px",
      "& a": {
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
    descItem: {
      fontSize: "12px",
      lineHeight: "20px",
    },
  };
});

export type Tab = {
  key: string;
  value: string;
  component: FC<{ canisterId: string; tokenId: number }>;
};

const TabList: Tab[] = [
  { key: "Transactions", value: t`Transactions`, component: NFTTransactions },
  { key: "Activity", value: t`Activity`, component: NFTActivity },
];

export default function NFTView() {
  const classes = useStyles();
  const history = useHistory();
  const { canisterId, tokenId } = useParams<{ canisterId: string; tokenId: string }>();

  const [tab, setTab] = useState<Tab>(TabList[0]);

  const handleLoadPage = useCallback(() => {
    history.push(`/nft/canister/details/${canisterId}`);
  }, [history]);

  const displayedComponent = () => {
    const ShowedComponent = TabList.filter((item) => item.key === tab.key)[0].component;
    return <ShowedComponent canisterId={canisterId} tokenId={Number(tokenId)} />;
  };

  const onTabChange = (tab: Tab) => {
    setTab(tab);
  };

  return (
    <Wrapper>
      <>
        <Box>
          <Breadcrumbs className={classes.breadcrumbs}>
            <ReactLink
              to="/"
              onClick={(e) => {
                e.preventDefault();
                handleLoadPage();
              }}
            >
              <Typography color="secondary">
                <Trans>NFT List</Trans>
              </Typography>
            </ReactLink>
            <Typography>
              <Trans>NFT Details</Trans>
            </Typography>
          </Breadcrumbs>
        </Box>

        <NFTInfo isView canisterId={canisterId} tokenId={Number(tokenId)} />

        <Box mt="24px">
          <MainCard level={2}>
            <Grid container spacing={3}>
              {TabList.map((item) => (
                <Grid item key={item.key}>
                  <Typography
                    color={item.key === tab.key ? "textPrimary" : "textSecondary"}
                    onClick={() => onTabChange(item)}
                    sx={{
                      cursor: "pointer",
                      fontSize: "20px",
                      fontWeight: "500",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Box mt={3}>{displayedComponent()}</Box>
          </MainCard>
        </Box>
      </>
    </Wrapper>
  );
}