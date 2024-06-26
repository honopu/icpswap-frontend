export const idlFactory = ({ IDL }: any) => {
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_7 = IDL.Variant({ ok: IDL.Text, err: Error });
  const Result_5 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: Error,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_3 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Deposit = IDL.Record({
    tickUpper: IDL.Int,
    rewardAmount: IDL.Nat,
    owner: IDL.Principal,
    liquidity: IDL.Nat,
    initTime: IDL.Nat,
    positionId: IDL.Nat,
    token0Amount: IDL.Int,
    holder: IDL.Principal,
    token1Amount: IDL.Int,
    tickLower: IDL.Int,
  });
  const Result_19 = IDL.Variant({ ok: Deposit, err: Error });
  const DistributeRecord = IDL.Record({
    rewardTotal: IDL.Nat,
    owner: IDL.Principal,
    positionId: IDL.Nat,
    timestamp: IDL.Nat,
    rewardGained: IDL.Nat,
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(DistributeRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_18 = IDL.Variant({ ok: Page_1, err: IDL.Text });
  const FarmStatus = IDL.Variant({
    LIVE: IDL.Null,
    NOT_STARTED: IDL.Null,
    CLOSED: IDL.Null,
    FINISHED: IDL.Null,
  });
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const FarmInfo = IDL.Record({
    startTime: IDL.Nat,
    status: FarmStatus,
    creator: IDL.Principal,
    totalRewardHarvested: IDL.Nat,
    numberOfStakes: IDL.Nat,
    rewardToken: Token,
    endTime: IDL.Nat,
    totalRewardBalance: IDL.Nat,
    pool: IDL.Principal,
    refunder: IDL.Principal,
    poolToken0: Token,
    poolToken1: Token,
    poolFee: IDL.Nat,
    totalRewardUnharvested: IDL.Nat,
    totalReward: IDL.Nat,
    userNumberOfStakes: IDL.Nat,
    positionIds: IDL.Vec(IDL.Nat),
  });
  const Result_17 = IDL.Variant({ ok: FarmInfo, err: Error });
  const InitFarmArgs = IDL.Record({
    fee: IDL.Nat,
    startTime: IDL.Nat,
    status: FarmStatus,
    secondPerCycle: IDL.Nat,
    farmControllerCid: IDL.Principal,
    creator: IDL.Principal,
    rewardToken: Token,
    endTime: IDL.Nat,
    pool: IDL.Principal,
    refunder: IDL.Principal,
    governanceCid: IDL.Opt(IDL.Principal),
    priceInsideLimit: IDL.Bool,
    token0AmountLimit: IDL.Nat,
    rewardPool: IDL.Principal,
    token1AmountLimit: IDL.Nat,
    totalReward: IDL.Nat,
    feeReceiverCid: IDL.Principal,
  });
  const Result_16 = IDL.Variant({ ok: InitFarmArgs, err: Error });
  const Result_15 = IDL.Variant({
    ok: IDL.Record({
      priceInsideLimit: IDL.Bool,
      positionNumLimit: IDL.Nat,
      token0AmountLimit: IDL.Nat,
      token1AmountLimit: IDL.Nat,
    }),
    err: Error,
  });
  const Result_14 = IDL.Variant({
    ok: IDL.Record({
      poolToken0Amount: IDL.Nat,
      totalLiquidity: IDL.Nat,
      poolToken1Amount: IDL.Nat,
    }),
    err: Error,
  });
  const Result_13 = IDL.Variant({ ok: IDL.Vec(IDL.Nat), err: Error });
  const Result_1 = IDL.Variant({ ok: IDL.Nat, err: Error });
  const Result_12 = IDL.Variant({
    ok: IDL.Record({
      secondPerCycle: IDL.Nat,
      totalRewardHarvested: IDL.Nat,
      totalRewardBalance: IDL.Nat,
      totalRewardFee: IDL.Nat,
      rewardPerCycle: IDL.Nat,
      totalCycleCount: IDL.Nat,
      totalRewardUnharvested: IDL.Nat,
      currentCycleCount: IDL.Nat,
      totalReward: IDL.Nat,
    }),
    err: Error,
  });
  const TransType = IDL.Variant({
    withdraw: IDL.Null,
    distribute: IDL.Null,
    unstake: IDL.Null,
    stake: IDL.Null,
    harvest: IDL.Null,
  });
  const StakeRecord = IDL.Record({
    to: IDL.Principal,
    transType: TransType,
    from: IDL.Principal,
    liquidity: IDL.Nat,
    positionId: IDL.Nat,
    timestamp: IDL.Nat,
    amount: IDL.Nat,
  });
  const Page = IDL.Record({
    content: IDL.Vec(StakeRecord),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_11 = IDL.Variant({ ok: Page, err: IDL.Text });
  const TokenAmount = IDL.Record({
    address: IDL.Text,
    amount: IDL.Nat,
    standard: IDL.Text,
  });
  const TVL = IDL.Record({
    rewardToken: TokenAmount,
    poolToken0: TokenAmount,
    poolToken1: TokenAmount,
  });
  const Result_10 = IDL.Variant({ ok: TVL, err: Error });
  const Result_9 = IDL.Variant({ ok: IDL.Vec(Deposit), err: Error });
  const Result_8 = IDL.Variant({
    ok: IDL.Record({
      poolToken0: TokenAmount,
      poolToken1: TokenAmount,
    }),
    err: Error,
  });
  return IDL.Service({
    clearErrorLog: IDL.Func([], [], []),
    close: IDL.Func([], [Result_7], []),
    finishManually: IDL.Func([], [Result_7], []),
    getAdmins: IDL.Func([], [Result_5], ["query"]),
    getCycleInfo: IDL.Func([], [Result_3], []),
    getDeposit: IDL.Func([IDL.Nat], [Result_19], ["query"]),
    getDistributeRecord: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [Result_18], ["query"]),
    getErrorLog: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    getFarmInfo: IDL.Func([IDL.Text], [Result_17], ["query"]),
    getInitArgs: IDL.Func([], [Result_16], ["query"]),
    getLimitInfo: IDL.Func([], [Result_15], ["query"]),
    getLiquidityInfo: IDL.Func([], [Result_14], ["query"]),
    getPoolMeta: IDL.Func(
      [],
      [
        IDL.Record({
          poolMetadata: IDL.Record({
            sqrtPriceX96: IDL.Nat,
            tick: IDL.Int,
          }),
          rewardPoolMetadata: IDL.Record({
            sqrtPriceX96: IDL.Nat,
            tick: IDL.Int,
          }),
        }),
      ],
      [],
    ),
    getPositionIds: IDL.Func([], [Result_13], ["query"]),
    getRewardInfo: IDL.Func([IDL.Vec(IDL.Nat)], [Result_1], ["query"]),
    getRewardMeta: IDL.Func([], [Result_12], ["query"]),
    getRewardTokenBalance: IDL.Func([], [IDL.Nat], []),
    getStakeRecord: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [Result_11], ["query"]),
    getTVL: IDL.Func([], [Result_10], ["query"]),
    getUserDeposits: IDL.Func([IDL.Principal], [Result_9], ["query"]),
    getUserTVL: IDL.Func([IDL.Principal], [Result_8], ["query"]),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    init: IDL.Func([], [], []),
    restartManually: IDL.Func([], [Result_7], []),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setLimitInfo: IDL.Func([IDL.Nat, IDL.Nat, IDL.Nat, IDL.Bool], [], []),
    stake: IDL.Func([IDL.Nat], [Result_7], []),
    unstake: IDL.Func([IDL.Nat], [Result_7], []),
    withdrawRewardFee: IDL.Func([], [Result_7], []),
  });
};
