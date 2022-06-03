import { Handler } from '@netlify/functions'
import { getApi } from 'libs/api'

const handler: Handler = async (event, context) => {
  const chainId = Number(event.queryStringParameters?.chainId || 137)
  const token = event.headers.authorization?.split(' ')[1] || ''
  const axios = getApi(chainId)
  const res = await axios.get('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  let verified = false
  try {
    await axios.get('/giveaway/verifications/discord', {
      headers: {
        'X-DISCORD-ACCESS-TOKEN': token,
      },
    })
    verified = true
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      ...res.data,
      verified,
    }),
  }
}

export { handler }
