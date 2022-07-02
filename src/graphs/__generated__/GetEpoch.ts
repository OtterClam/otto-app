/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetEpoch
// ====================================================

export interface GetEpoch_epoches {
  __typename: "Epoch";
  totalOttos: number;
}

export interface GetEpoch {
  epoches: GetEpoch_epoches[];
}

export interface GetEpochVariables {
  epoch: number;
}
