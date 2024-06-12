import { INFO_URL } from "constants/index";
import TwitterIcon from "./icons/Twitter";
import TelegramIcon from "./icons/Telegram";
import DiscordIcon from "./icons/Discord";
import WebsiteIcon from "./icons/Website";
import MediumIcon from "./icons/Medium";
import GithubIcon from "./icons/Github";
import GitbookIcon from "./icons/Gitbook";
import DSCVRIcon from "./icons/DSCVR";
import SimpleModeIcon from "./icons/SimpleMode";
import ProModeIcon from "./icons/ProMode";
import { version } from "../../../.version";

export type Route = {
  name: string;
  path?: string;
  link?: string;
  subMenus?: SubMenu[];
  key: string;
  icon?: () => JSX.Element;
  disabled?: boolean;
};

export type SubMenu = Route;

export const MAX_NUMBER = 7;

export const MOBILE_MAX_NUMBER = 7;

export const routes: Route[] = [
  {
    key: "swap",
    name: `Swap`,
    path: "/swap",
    subMenus: [
      { key: "simple-mode", name: `Simple mode`, path: "/swap", icon: SimpleModeIcon },
      { key: "pro-mode", name: `Pro mode`, path: "/swap/pro", icon: ProModeIcon },
    ],
  },
  {
    key: "liquidity",
    name: `Liquidity`,
    path: "/liquidity",
  },
  {
    key: "staking-token",
    name: `Stake V2`,
    path: "/staking-token",
    subMenus: [
      { key: "staking-token", name: `Stake V2`, path: "/staking-token" },
      { key: "stake-v1", name: `Stake V1`, path: "/stake-v1" },
    ],
  },
  {
    key: "farm",
    name: `Farm`,
    path: `/farm`,
  },
  {
    key: "marketplace",
    name: `Marketplace`,
    path: "/marketplace/collections",
  },
  {
    key: "wallet",
    name: `Wallet`,
    path: `/wallet`,
  },
  {
    key: "info",
    name: `Info`,
    link: INFO_URL,
  },
  {
    key: "sns",
    name: `SNS(Beta)`,
    path: `/sns/neurons`,
  },
  {
    key: "voting",
    name: `Voting`,
    path: `/voting`,
  },
  {
    key: "console",
    name: `Console`,
    path: `/console`,
  },
  {
    key: "followUS",
    name: `Follow US`,
    subMenus: [
      { key: "followUS_twitter", name: `Twitter`, link: "https://twitter.com/ICPSwap", icon: TwitterIcon },
      { key: "followUS_Telegram", name: `Telegram`, link: "https://t.me/ICPSwap_Official", icon: TelegramIcon },
      {
        key: "followUS_DSCVR",
        name: `DSCVR`,
        link: "https://h5aet-waaaa-aaaab-qaamq-cai.raw.ic0.app/p/icpswap",
        icon: DSCVRIcon,
      },
      { key: "followUS_Medium", name: `Medium`, link: "https://icpswap.medium.com/", icon: MediumIcon },
      { key: "followUS_Gitbook", name: `Gitbook`, link: "https://iloveics.gitbook.io/icpswap/", icon: GitbookIcon },
      { key: "followUS_Github", name: `Github`, link: "https://github.com/ICPSwap-Labs", icon: GithubIcon },
      { key: "followUS_Discord", name: `Discord`, link: "https://discord.gg/UFDTQkBfEB", icon: DiscordIcon },
      { key: "followUS_Website", name: `Website`, link: "http://icpswap.com/", icon: WebsiteIcon },
    ],
  },
  // {
  //   key: "feedback",
  //   name: "Feedback",
  //   link: "https://forms.gle/E1WAEfemwDBnLmY66",
  // },
  {
    key: "wrap",
    name: "WICP",
    path: "/swap/v2/wrap",
  },
  {
    key: "version",
    name: `Version ${version}`,
    path: "",
    disabled: true,
  },
];
