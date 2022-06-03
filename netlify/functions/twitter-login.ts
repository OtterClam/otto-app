import { Handler } from '@netlify/functions'
import { generateOAuthURL } from '../libs/twitter'

const handler: Handler = async (event, context) => {
  const authUrl = await generateOAuthURL()
  return {
    statusCode: 302,
    headers: {
      location: authUrl,
    },
  }
}

export { handler }
