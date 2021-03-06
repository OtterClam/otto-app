/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IOttoItemFactory,
  IOttoItemFactoryInterface,
} from "../IOttoItemFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orderId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "CreateOrder",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orderId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "randomness",
        type: "uint256",
      },
    ],
    name: "EstablishOrder",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orderId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
    ],
    name: "ShipOrder",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "fromProductId_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "productAmount_",
        type: "uint256",
      },
    ],
    name: "order",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orderId_",
        type: "bytes32",
      },
    ],
    name: "ship",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IOttoItemFactory__factory {
  static readonly abi = _abi;
  static createInterface(): IOttoItemFactoryInterface {
    return new utils.Interface(_abi) as IOttoItemFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IOttoItemFactory {
    return new Contract(address, _abi, signerOrProvider) as IOttoItemFactory;
  }
}
