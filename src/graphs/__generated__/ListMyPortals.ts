/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PortalStatus } from "./../../__generated__/otto/global-types";

// ====================================================
// GraphQL query operation: ListMyPortals
// ====================================================

export interface ListMyPortals_ottos {
  __typename: "Otto";
  tokenId: any;
  tokenURI: string;
  portalStatus: PortalStatus;
  canOpenAt: any;
  mintAt: any;
  candidates: any[];
  legendary: boolean;
}

export interface ListMyPortals {
  ottos: ListMyPortals_ottos[];
}

export interface ListMyPortalsVariables {
  owner: any;
}
