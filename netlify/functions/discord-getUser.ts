import { Handler } from '@netlify/functions'
import axios from 'axios'

const handler: Handler = async (event, context) => {
  const token = event.headers.authorization.split(' ')[1]
  const res = await axios.get('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return {
    statusCode: 200,
    headers: {
      'set-cookie': `discord_token=${token}; Path=/; HttpOnly; Max-Age=7200`,
    },
    body: JSON.stringify(res.data),
  }
}

export { handler }
