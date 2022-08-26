/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OtterClamUserVotes
// ====================================================

export interface OtterClamUserVotes_votes_proposal_space {
  __typename: "Space";
  id: string;
}

export interface OtterClamUserVotes_votes_proposal_strategies {
  __typename: "Strategy";
  network: string | null;
  params: any | null;
}

export interface OtterClamUserVotes_votes_proposal {
  __typename: "Proposal";
  id: string;
  title: string;
  body: string | null;
  choices: (string | null)[];
  start: number;
  end: number;
  snapshot: string | null;
  state: string | null;
  scores: (number | null)[] | null;
  votes: number | null;
  type: string | null;
  space: OtterClamUserVotes_votes_proposal_space | null;
  strategies: (OtterClamUserVotes_votes_proposal_strategies | null)[];
}

export interface OtterClamUserVotes_votes {
  __typename: "Vote";
  choice: any;
  vp: number | null;
  vp_by_strategy: (number | null)[] | null;
  proposal: OtterClamUserVotes_votes_proposal | null;
}

export interface OtterClamUserVotes {
  votes: (OtterClamUserVotes_votes | null)[] | null;
}

export interface OtterClamUserVotesVariables {
  address: string;
}
