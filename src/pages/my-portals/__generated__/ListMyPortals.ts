/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PortalStatus } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: ListMyPortals
// ====================================================

export interface ListMyPortals_ottos {
  __typename: "Otto";
  tokenId: BigInt;
  tokenURI: string;
  portalStatus: PortalStatus;
  canSummonAt: BigInt;
  mintAt: BigInt;
}

export interface ListMyPortals {
  ottos: ListMyPortals_ottos[];
}

export interface ListMyPortalsVariables {
  owner: Bytes;
}
