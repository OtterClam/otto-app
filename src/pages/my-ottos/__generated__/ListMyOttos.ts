/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PortalStatus } from "./../../../__generated__/global-types";

// ====================================================
// GraphQL query operation: ListMyOttos
// ====================================================

export interface ListMyOttos_ottos {
  __typename: "Otto";
  tokenId: any;
  tokenURI: string;
  portalStatus: PortalStatus;
  canOpenAt: any;
  mintAt: any;
  legendary: boolean;
}

export interface ListMyOttos {
  ottos: ListMyOttos_ottos[];
}

export interface ListMyOttosVariables {
  owner: any;
}
