/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface OttopiaPortalCreatorInterface extends utils.Interface {
  functions: {
    "CLAM()": FunctionFragment;
    "MAI()": FunctionFragment;
    "MAICLAM()": FunctionFragment;
    "OTTO()": FunctionFragment;
    "WETH()": FunctionFragment;
    "addOttolisted(uint256,address[])": FunctionFragment;
    "adjustSaleConfig(uint8,uint256,uint256)": FunctionFragment;
    "clamPerWETH()": FunctionFragment;
    "dao()": FunctionFragment;
    "devCanMint()": FunctionFragment;
    "devMint(address,uint256)": FunctionFragment;
    "distribute()": FunctionFragment;
    "emergencyWithdraw(address)": FunctionFragment;
    "initialize(address,address,address,address,address,address)": FunctionFragment;
    "mint(address,uint256,uint256,bool)": FunctionFragment;
    "ottolisted(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "priceInCLAM()": FunctionFragment;
    "priceInWETH()": FunctionFragment;
    "proxiableUUID()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "saleConfig(uint8)": FunctionFragment;
    "saleStage()": FunctionFragment;
    "setOttolisted(uint256,address[])": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "upgradeTo(address)": FunctionFragment;
    "upgradeToAndCall(address,bytes)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "CLAM"
      | "MAI"
      | "MAICLAM"
      | "OTTO"
      | "WETH"
      | "addOttolisted"
      | "adjustSaleConfig"
      | "clamPerWETH"
      | "dao"
      | "devCanMint"
      | "devMint"
      | "distribute"
      | "emergencyWithdraw"
      | "initialize"
      | "mint"
      | "ottolisted"
      | "owner"
      | "priceInCLAM"
      | "priceInWETH"
      | "proxiableUUID"
      | "renounceOwnership"
      | "saleConfig"
      | "saleStage"
      | "setOttolisted"
      | "transferOwnership"
      | "upgradeTo"
      | "upgradeToAndCall"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "CLAM", values?: undefined): string;
  encodeFunctionData(functionFragment: "MAI", values?: undefined): string;
  encodeFunctionData(functionFragment: "MAICLAM", values?: undefined): string;
  encodeFunctionData(functionFragment: "OTTO", values?: undefined): string;
  encodeFunctionData(functionFragment: "WETH", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "addOttolisted",
    values: [BigNumberish, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "adjustSaleConfig",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "clamPerWETH",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "dao", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "devCanMint",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "devMint",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "distribute",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "emergencyWithdraw",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [string, BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(functionFragment: "ottolisted", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "priceInCLAM",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "priceInWETH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "saleConfig",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "saleStage", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setOttolisted",
    values: [BigNumberish, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "upgradeTo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [string, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "CLAM", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "MAI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "MAICLAM", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "OTTO", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "WETH", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addOttolisted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "adjustSaleConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "clamPerWETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "dao", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "devCanMint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "devMint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "distribute", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "emergencyWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ottolisted", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "priceInCLAM",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "priceInWETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "saleConfig", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "saleStage", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setOttolisted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "BeaconUpgraded(address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Upgraded(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}

export interface AdminChangedEventObject {
  previousAdmin: string;
  newAdmin: string;
}
export type AdminChangedEvent = TypedEvent<
  [string, string],
  AdminChangedEventObject
>;

export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;

export interface BeaconUpgradedEventObject {
  beacon: string;
}
export type BeaconUpgradedEvent = TypedEvent<
  [string],
  BeaconUpgradedEventObject
>;

export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface UpgradedEventObject {
  implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;

export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;

export interface OttopiaPortalCreator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OttopiaPortalCreatorInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    CLAM(overrides?: CallOverrides): Promise<[string]>;

    MAI(overrides?: CallOverrides): Promise<[string]>;

    MAICLAM(overrides?: CallOverrides): Promise<[string]>;

    OTTO(overrides?: CallOverrides): Promise<[string]>;

    WETH(overrides?: CallOverrides): Promise<[string]>;

    addOttolisted(
      amount_: BigNumberish,
      wallets: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    adjustSaleConfig(
      stage_: BigNumberish,
      timestamp_: BigNumberish,
      price_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    clamPerWETH(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { clamPerWETH_: BigNumber }>;

    dao(overrides?: CallOverrides): Promise<[string]>;

    devCanMint(overrides?: CallOverrides): Promise<[BigNumber]>;

    devMint(
      to_: string,
      quantity_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    distribute(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    emergencyWithdraw(
      token_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initialize(
      otto_: string,
      weth_: string,
      maiclam_: string,
      wethPriceFeed_: string,
      treasury_: string,
      dao_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    mint(
      to_: string,
      quantity_: BigNumberish,
      maxPrice_: BigNumberish,
      payInCLAM: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ottolisted(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    priceInCLAM(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { price_: BigNumber }>;

    priceInWETH(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { price_: BigNumber }>;

    proxiableUUID(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    saleConfig(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { timestamp: BigNumber; price: BigNumber }
    >;

    saleStage(
      overrides?: CallOverrides
    ): Promise<[number] & { stage_: number }>;

    setOttolisted(
      amount_: BigNumberish,
      wallets: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  CLAM(overrides?: CallOverrides): Promise<string>;

  MAI(overrides?: CallOverrides): Promise<string>;

  MAICLAM(overrides?: CallOverrides): Promise<string>;

  OTTO(overrides?: CallOverrides): Promise<string>;

  WETH(overrides?: CallOverrides): Promise<string>;

  addOttolisted(
    amount_: BigNumberish,
    wallets: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  adjustSaleConfig(
    stage_: BigNumberish,
    timestamp_: BigNumberish,
    price_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  clamPerWETH(overrides?: CallOverrides): Promise<BigNumber>;

  dao(overrides?: CallOverrides): Promise<string>;

  devCanMint(overrides?: CallOverrides): Promise<BigNumber>;

  devMint(
    to_: string,
    quantity_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  distribute(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  emergencyWithdraw(
    token_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initialize(
    otto_: string,
    weth_: string,
    maiclam_: string,
    wethPriceFeed_: string,
    treasury_: string,
    dao_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  mint(
    to_: string,
    quantity_: BigNumberish,
    maxPrice_: BigNumberish,
    payInCLAM: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ottolisted(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  priceInCLAM(overrides?: CallOverrides): Promise<BigNumber>;

  priceInWETH(overrides?: CallOverrides): Promise<BigNumber>;

  proxiableUUID(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  saleConfig(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { timestamp: BigNumber; price: BigNumber }
  >;

  saleStage(overrides?: CallOverrides): Promise<number>;

  setOttolisted(
    amount_: BigNumberish,
    wallets: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgradeTo(
    newImplementation: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgradeToAndCall(
    newImplementation: string,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    CLAM(overrides?: CallOverrides): Promise<string>;

    MAI(overrides?: CallOverrides): Promise<string>;

    MAICLAM(overrides?: CallOverrides): Promise<string>;

    OTTO(overrides?: CallOverrides): Promise<string>;

    WETH(overrides?: CallOverrides): Promise<string>;

    addOttolisted(
      amount_: BigNumberish,
      wallets: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    adjustSaleConfig(
      stage_: BigNumberish,
      timestamp_: BigNumberish,
      price_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    clamPerWETH(overrides?: CallOverrides): Promise<BigNumber>;

    dao(overrides?: CallOverrides): Promise<string>;

    devCanMint(overrides?: CallOverrides): Promise<BigNumber>;

    devMint(
      to_: string,
      quantity_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    distribute(overrides?: CallOverrides): Promise<void>;

    emergencyWithdraw(token_: string, overrides?: CallOverrides): Promise<void>;

    initialize(
      otto_: string,
      weth_: string,
      maiclam_: string,
      wethPriceFeed_: string,
      treasury_: string,
      dao_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    mint(
      to_: string,
      quantity_: BigNumberish,
      maxPrice_: BigNumberish,
      payInCLAM: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    ottolisted(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    priceInCLAM(overrides?: CallOverrides): Promise<BigNumber>;

    priceInWETH(overrides?: CallOverrides): Promise<BigNumber>;

    proxiableUUID(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    saleConfig(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { timestamp: BigNumber; price: BigNumber }
    >;

    saleStage(overrides?: CallOverrides): Promise<number>;

    setOttolisted(
      amount_: BigNumberish,
      wallets: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeTo(
      newImplementation: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AdminChanged(address,address)"(
      previousAdmin?: null,
      newAdmin?: null
    ): AdminChangedEventFilter;
    AdminChanged(
      previousAdmin?: null,
      newAdmin?: null
    ): AdminChangedEventFilter;

    "BeaconUpgraded(address)"(
      beacon?: string | null
    ): BeaconUpgradedEventFilter;
    BeaconUpgraded(beacon?: string | null): BeaconUpgradedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Upgraded(address)"(implementation?: string | null): UpgradedEventFilter;
    Upgraded(implementation?: string | null): UpgradedEventFilter;
  };

  estimateGas: {
    CLAM(overrides?: CallOverrides): Promise<BigNumber>;

    MAI(overrides?: CallOverrides): Promise<BigNumber>;

    MAICLAM(overrides?: CallOverrides): Promise<BigNumber>;

    OTTO(overrides?: CallOverrides): Promise<BigNumber>;

    WETH(overrides?: CallOverrides): Promise<BigNumber>;

    addOttolisted(
      amount_: BigNumberish,
      wallets: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    adjustSaleConfig(
      stage_: BigNumberish,
      timestamp_: BigNumberish,
      price_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    clamPerWETH(overrides?: CallOverrides): Promise<BigNumber>;

    dao(overrides?: CallOverrides): Promise<BigNumber>;

    devCanMint(overrides?: CallOverrides): Promise<BigNumber>;

    devMint(
      to_: string,
      quantity_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    distribute(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    emergencyWithdraw(
      token_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initialize(
      otto_: string,
      weth_: string,
      maiclam_: string,
      wethPriceFeed_: string,
      treasury_: string,
      dao_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    mint(
      to_: string,
      quantity_: BigNumberish,
      maxPrice_: BigNumberish,
      payInCLAM: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ottolisted(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    priceInCLAM(overrides?: CallOverrides): Promise<BigNumber>;

    priceInWETH(overrides?: CallOverrides): Promise<BigNumber>;

    proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    saleConfig(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    saleStage(overrides?: CallOverrides): Promise<BigNumber>;

    setOttolisted(
      amount_: BigNumberish,
      wallets: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    CLAM(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MAI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MAICLAM(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    OTTO(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    WETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addOttolisted(
      amount_: BigNumberish,
      wallets: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    adjustSaleConfig(
      stage_: BigNumberish,
      timestamp_: BigNumberish,
      price_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    clamPerWETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    dao(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    devCanMint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    devMint(
      to_: string,
      quantity_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    distribute(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    emergencyWithdraw(
      token_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      otto_: string,
      weth_: string,
      maiclam_: string,
      wethPriceFeed_: string,
      treasury_: string,
      dao_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    mint(
      to_: string,
      quantity_: BigNumberish,
      maxPrice_: BigNumberish,
      payInCLAM: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ottolisted(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    priceInCLAM(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    priceInWETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    saleConfig(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    saleStage(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setOttolisted(
      amount_: BigNumberish,
      wallets: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
