import Head from 'next/head'

export default function DefaultMetaTags() {
  return (
    <Head>
      <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1" />
      <meta property="og:title" content="Otto | The first official citizen of the Otter Kingdom" />
      <meta
        name="description"
        content="Otto is the first official citizen of the Otter Kingdom. Each Otto is an ERC721 NFT with unique traits and attributes. These NFTs are not only irresistibly cute, but they also happen to be the main characters of OtterClam’s first adventure game – Ottopia."
      />
      <meta
        property="og:description"
        content=" Otto is the first official citizen of the Otter Kingdom. Each Otto is an ERC721 NFT with unique traits and attributes. These NFTs are not only irresistibly cute, but they also happen to be the main characters of OtterClam’s first adventure game – Ottopia."
      />
      <meta property="og:image" content="/og.jpg" />
    </Head>
  )
}
