import { Handler } from '@netlify/functions'
import { generateAuthURL } from '../libs/twitter'

const handler: Handler = async (event, context) => {
  const authUrl = await generateAuthURL()
  return {
    statusCode: 302,
    headers: {
      location: authUrl,
    },
  }
}

export { handler }
