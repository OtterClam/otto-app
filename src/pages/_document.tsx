/* eslint-disable jsx-a11y/iframe-has-title */
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://polygon-rpc.com" />
        <link rel="preconnect" href="https://api.otterclam.finance" />
        <link rel="preconnect" href="https://api.thegraph.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />

        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/max32002/naikaifont@1.0/webfont/NaikaiFont-Regular-Lite.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link rel="preload" href="/fonts/Pangolin-Regular.ttf" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/ottoclick.mp3" as="audio" type="audio/mpeg" crossOrigin="" />

        <script>
          {`
          ;(function (w, d, s, l, i) {
            w[l] = w[l] || []
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
            var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != 'dataLayer' ? '&l=' + l : ''
            j.async = true
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
            f.parentNode.insertBefore(j, f)
          })(window, document, 'script', 'dataLayer', 'GTM-W4MP2GV')
        `}
        </script>
        <title>Otto | The first official citizen of the Otter Kingdom</title>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:title" content="Otto | The first official citizen of the Otter Kingdom" />
        <meta
          name="description"
          content="Otto is the first official citizen of the Otter Kingdom. Each Otto is an ERC721 NFT with unique traits and attributes. These NFTs are not only irresistibly cute, but they also happen to be the main characters of OtterClam’s first adventure game – Ottopia."
        />
        <meta
          property="og:description"
          content=" Otto is the first official citizen of the Otter Kingdom. Each Otto is an ERC721 NFT with unique traits and attributes. These NFTs are not only irresistibly cute, but they also happen to be the main characters of OtterClam’s first adventure game – Ottopia."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="%PUBLIC_URL%/og.jpg" />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
      </Head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W4MP2GV"
            height="0"
            width="0"
            style={{
              display: 'none',
              visibility: 'hidden',
            }}
          />
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
