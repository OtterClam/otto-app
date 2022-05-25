import { Handler } from '@netlify/functions'
import { Client } from 'twitter-api-sdk'

const handler: Handler = async (event, context) => {
  const token = event.headers.cookie.split('twitter_token=')[1].split(';')[0]
  const client = new Client(token)
  const user = await client.users.findMyUser()
  return {
    statusCode: 200,
    body: JSON.stringify(user.data),
  }
}

export { handler }
