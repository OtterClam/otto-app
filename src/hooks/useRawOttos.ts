import { useQuery } from '@apollo/client'
import { GET_OTTOS } from 'graphs/otto'
import { GetOttos, GetOttosVariables } from 'graphs/__generated__/GetOttos'

export default function useRawOttos(tokenIds: string[]) {
  return useQuery<GetOttos, GetOttosVariables>(GET_OTTOS, {
    variables: {
      tokenIds,
    },
  })
}
