import { Handler } from '@netlify/functions'
import { getAuthToken } from '../libs/twitter'

const handler: Handler = async (event, context) => {
  const { code, state } = event.queryStringParameters
  const token = await getAuthToken(state, code)
  return {
    statusCode: 302,
    headers: {
      'set-cookie': `twitter_token=${token}; Path=/; HttpOnly; Max-Age=7200`,
      location: `/giveaway`,
    },
  }
}

export { handler }
