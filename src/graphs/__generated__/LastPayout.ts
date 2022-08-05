/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LastPayout
// ====================================================

export interface LastPayout_stakedBalances {
  __typename: "StakedBalance";
  id: string;
  clamPondLastPayout: any;
  clamPondLastPayoutUsd: any;
  pearlBankLastPayout: any;
}

export interface LastPayout {
  stakedBalances: LastPayout_stakedBalances[];
}

export interface LastPayoutVariables {
  address: any;
}
