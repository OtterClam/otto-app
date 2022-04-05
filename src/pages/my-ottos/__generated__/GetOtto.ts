/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PortalStatus } from "./../../../__generated__/global-types";

// ====================================================
// GraphQL query operation: GetOtto
// ====================================================

export interface GetOtto_ottos {
  __typename: "Otto";
  tokenId: any;
  tokenURI: string;
  portalStatus: PortalStatus;
  canOpenAt: any;
  mintAt: any;
  candidates: any[];
  legendary: boolean;
}

export interface GetOtto {
  ottos: GetOtto_ottos[];
}

export interface GetOttoVariables {
  ottoId: any;
}
