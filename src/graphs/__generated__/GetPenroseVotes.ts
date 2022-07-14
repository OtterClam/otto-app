/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPenroseVotes
// ====================================================

export interface GetPenroseVotes_votePosition_votes {
  __typename: "Vote";
  id: string;
  timestamp: any;
  vote: any;
}

export interface GetPenroseVotes_votePosition {
  __typename: "VotePosition";
  votes: GetPenroseVotes_votePosition_votes[] | null;
}

export interface GetPenroseVotes {
  votePosition: GetPenroseVotes_votePosition | null;
}
