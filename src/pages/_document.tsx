/* eslint-disable jsx-a11y/iframe-has-title */
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import Script from 'next/script'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

export default class MyDocument extends Document<{ asPath: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        asPath: ctx.asPath,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://polygon-rpc.com" />
          <link rel="preconnect" href="https://api.otterclam.finance" />
          <link rel="preconnect" href="https://api.thegraph.com" />
          <link rel="preconnect" href="https://cdn.jsdelivr.net" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="canonical" href={process.env.BASE_URL + this.props.asPath} />
          <meta name="theme-color" content="#000000" />
          <meta property="og:type" content="website" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body className="loading">
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
          <Script
            id="gtm-script"
            src="https://www.googletagmanager.com/gtm.js?id=GTM-W4MP2GV"
            strategy="afterInteractive"
            onLoad={() => {
              window.dataLayer = window.dataLayer || []
              window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
            }}
          />
          <div id="modal-root" />
        </body>
      </Html>
    )
  }
}
