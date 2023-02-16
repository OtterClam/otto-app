import { useEthers } from '@usedapp/core'
import { Contract } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { OtterMine } from './__generated__'
import MineAbi from './abis/OtterMine.json'

export default function useOtterMine() {
  const { MINE } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(MINE, MineAbi, library) as OtterMine
}
