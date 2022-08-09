export const changeNetwork = async (chainId: number): Promise<void> => {
  try {
    await (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
  } catch (err: any) {
    if (err.code === 4902) {
      ;(window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        // https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/
        params: [
          {
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18,
            },
            blockExplorerUrls: ['https://polygonscan.com/'],
            rpcUrls: ['https://polygon-rpc.com/'],
          },
        ],
      })
    }
  }
}
