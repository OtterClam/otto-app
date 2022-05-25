import axios from 'axios'
import Button from 'components/Button'
import { useEffect, useState } from 'react'
import { Caption } from 'styles/typography'

export default function GiveawayPage() {
  const [twitterUser, setTwitterUser] = useState<string | null>(null)
  // const [twitterWindow, setTwitterWindow] = useState<Window | null>(null)
  // const onTwitterLogin = async () => {
  //   setTwitterWindow(
  //     window.open('/.netlify/functions/twitter-login', 'Twitter Auth', 'popup,left=100,top=100,width=640,height=640')
  //   )
  // }
  useEffect(() => {
    axios
      .get('/.netlify/functions/twitter-getUser')
      .then(res => setTwitterUser(res.data.username))
      .catch(err => console.warn(err))
    // if (twitterWindow) {
    //   const interval = setInterval(() => {
    //     if (twitterWindow.closed) {
    //       setTwitterWindow(null)
    //       clearInterval(interval)
    //       axios.get('/.netlify/functions/twitter-getUser').then(res => {
    //         setTwitterUser(res.data.username)
    //       })
    //     }
    //   }, 500)
    // }
  }, [])

  return (
    <div>
      {twitterUser ? (
        <Caption>{twitterUser}</Caption>
      ) : (
        <a href="/.netlify/functions/twitter-login">
          <Button>Twitter Login</Button>
        </a>
      )}
    </div>
  )
}
