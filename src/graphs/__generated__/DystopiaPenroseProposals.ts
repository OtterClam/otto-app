/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DystopiaPenroseProposals
// ====================================================

export interface DystopiaPenroseProposals_proposals_space {
  __typename: "Space";
  id: string;
}

export interface DystopiaPenroseProposals_proposals {
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
  space: DystopiaPenroseProposals_proposals_space | null;
}

export interface DystopiaPenroseProposals {
  proposals: (DystopiaPenroseProposals_proposals | null)[] | null;
}
