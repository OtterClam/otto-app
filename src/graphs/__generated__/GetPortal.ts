/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PortalStatus } from "./../../__generated__/otto/global-types";

// ====================================================
// GraphQL query operation: GetPortal
// ====================================================

export interface GetPortal_ottos {
  __typename: "Otto";
  tokenId: any;
  tokenURI: string;
  portalStatus: PortalStatus;
  canOpenAt: any;
  mintAt: any;
  candidates: any[];
  legendary: boolean;
}

export interface GetPortal {
  ottos: GetPortal_ottos[];
}

export interface GetPortalVariables {
  portalId: any;
}
