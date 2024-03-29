/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QiDaoVotes
// ====================================================

export interface QiDaoVotes_votes_proposal_space {
  __typename: "Space";
  id: string;
}

export interface QiDaoVotes_votes_proposal {
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
  space: QiDaoVotes_votes_proposal_space | null;
}

export interface QiDaoVotes_votes {
  __typename: "Vote";
  choice: any;
  vp: number | null;
  proposal: QiDaoVotes_votes_proposal | null;
}

export interface QiDaoVotes {
  votes: (QiDaoVotes_votes | null)[] | null;
}
