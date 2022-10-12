/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetEpoch
// ====================================================

export interface GetEpoch_epoches {
  __typename: "Epoch";
  num: number;
  totalOttos: number;
  startedAt: number;
  endedAt: number;
  themeLabels: string[];
  themeBoostBase: number;
  constellation: number;
  constellationBoost: number;
}

export interface GetEpoch_latestEpoch {
  __typename: "Epoch";
  num: number;
  totalOttos: number;
  startedAt: number;
  endedAt: number;
  themeLabels: string[];
  themeBoostBase: number;
  constellation: number;
  constellationBoost: number;
}

export interface GetEpoch {
  epoches: GetEpoch_epoches[];
  latestEpoch: GetEpoch_latestEpoch[];
}

export interface GetEpochVariables {
  epoch: number;
}
